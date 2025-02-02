<template>
  <div
    class="flex flex-col md:flex-row justify-between h-full"
    ref="formContainer"
  >
    <div class="w-full md:w-3/5 mb-6 md:mb-0 md:pr-6">
      <div class="text-center border-gray-300 py-2 mb-10">
        <h3 class="font-bold text-[#1c592f]">
          {{ $t("form.title") }}
        </h3>
      </div>

      <div class="mb-6">
        <div class="form-group mb-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.city") }}
              </h3>
              <input
                type="text"
                id="interestsAutocompleteInput"
                :placeholder="$t('form.cityPlaceholder')"
                class="input-field"
                :class="{ 'border-red-500': errors.step1?.city }"
                @input="clearError('city')"
              />
              <p class="font-small text-gray-600 mt-2">
                {{ $t("form.locationHint") }}
              </p>
            </div>

            <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <div class="tags-container flex flex-wrap mt-2">
                <span
                  v-for="(city, index) in selectedCities"
                  :key="index"
                  class="tag bg-gray-200 p-2 rounded-full mr-2 mb-2 font-medium"
                >
                  {{ city }}
                  <span
                    @click="removeCity(city)"
                    class="cursor-pointer text-red-500 ml-1"
                    >&times;</span
                  >
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group mb-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.houseType") }}
              </h3>
              <div class="relative" ref="houseTypeDropdown">
                <input
                  type="text"
                  v-model="selectedHouseTypeName"
                  :placeholder="$t('form.houseTypePlaceholder')"
                  readonly
                  class="input-field cursor-pointer"
                  @click="
                    toggleDropdown('houseType');
                    clearError('house_type_id');
                  "
                  :class="{ 'border-red-500': errors.step1?.house_type_id }"
                />
                <span
                  class="dropdown-icon"
                  :class="{ open: showHouseTypeDropdown }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 h-4 transition-transform duration-300"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <ul v-show="showHouseTypeDropdown" class="dropdown-content">
                  <li
                    v-for="(type, index) in houseTypes"
                    :key="index"
                    @click="selectHouseType(type)"
                    class="p-2 hover:bg-gray-100 cursor-pointer font-medium"
                  >
                    {{ type.type }}
                  </li>
                </ul>
              </div>
              <div v-if="errors.house_type_wish" class="invalid-feedback">
                {{ errors.house_type_wish }}
              </div>
            </div>
            <div class="w-full md:w-1/2 px-2">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.maxRentPrice") }}
              </h3>
              <input
                type="number"
                v-model="formData.wish.price"
                :placeholder="$t('form.pricePlaceholder')"
                class="input-field"
                :class="{ 'border-red-500': errors.step1?.price }"
                @input="clearError('price')"
                step="0.01"
              />
              <div v-if="errors.price_wish" class="invalid-feedback">
                {{ errors.price_wish }}
              </div>
            </div>
          </div>
        </div>

        <div class="form-group mb-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/2 px-2">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.minRooms") }}
              </h3>
              <ul class="flex w-full no-gap-list">
                <li
                  v-for="(number, index) in numberOfRooms"
                  :key="index"
                  @click="
                    selectNumberOfRooms(number);
                    clearError('number_of_rooms');
                  "
                  class="flex-1 p-2 border border-gray-300 rounded cursor-pointer text-center room-item font-medium"
                  :class="[
                    roomClasses(number),
                    errors.step1?.number_of_rooms ? 'border-red-500' : '',
                  ]"
                >
                  {{ number }}
                </li>
              </ul>
              <div v-if="errors.number_of_rooms_wish" class="invalid-feedback">
                {{ errors.number_of_rooms_wish }}
              </div>
            </div>
            <div class="w-full md:w-1/2 px-2">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.floor") }}
              </h3>
              <ul class="flex w-full no-gap-list">
                <li
                  v-for="(floor, index) in floorOptions"
                  :key="index"
                  @click="
                    selectFloor(floor);
                    clearError('floor_number');
                  "
                  class="flex-1 p-2 border border-gray-300 rounded cursor-pointer text-center room-item font-medium"
                  :class="[
                    floorClasses(floor),
                    errors.step1?.floor_number ? 'border-red-500' : '',
                  ]"
                >
                  {{ floor === 0 ? "G" : floor }}
                </li>
              </ul>
              <div v-if="errors.floor_wish" class="invalid-feedback">
                {{ errors.floor_wish }}
              </div>
            </div>
          </div>
        </div>

        <div class="form-group mb-4">
          <div class="flex flex-wrap -mx-2">
            <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.minArea") }}
              </h3>
              <div class="relative" ref="areaDropdown">
                <input
                  type="text"
                  v-model="formData.wish.area"
                  :placeholder="$t('form.areaPlaceholder')"
                  readonly
                  class="input-field cursor-pointer"
                  :class="{ 'border-red-500': errors.step1?.area }"
                  @input="clearError('area')"
                  @click="
                    toggleDropdown('area');
                    clearError('area');
                  "
                />
                <span class="dropdown-icon" :class="{ open: showAreaDropdown }">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 h-4 transition-transform duration-300"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <ul v-show="showAreaDropdown" class="dropdown-content">
                  <li
                    v-for="(area, index) in areas"
                    :key="index"
                    @click="selectArea(area)"
                    class="p-2 hover:bg-gray-100 cursor-pointer font-medium"
                  >
                    {{ area }}
                  </li>
                </ul>
              </div>
              <div v-if="errors.area_wish" class="invalid-feedback">
                {{ errors.area_wish }}
              </div>
            </div>
            <div class="w-full md:w-1/2 px-2">
              <h3 class="font-semibold text-[#1c592f] mb-2">
                {{ $t("form.houseFeatures") }}
              </h3>
              <div class="relative" ref="featuresDropdown">
                <input
                  type="text"
                  v-model="selectedFeatureNames"
                  :placeholder="$t('form.featuresPlaceholder')"
                  readonly
                  class="input-field cursor-pointer"
                  :class="{ 'border-red-500': errors.step1?.features }"
                  @click="
                    toggleDropdown('features');
                    clearError('features');
                  "
                />
                <span
                  class="dropdown-icon"
                  :class="{ open: showFeaturesDropdown }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-4 h-4 transition-transform duration-300"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <ul v-show="showFeaturesDropdown" class="dropdown-content">
                  <li
                    v-for="(feature, index) in features"
                    :key="index"
                    @click="toggleFeature(feature)"
                    :class="{
                      'bg-gray-200': (formData.wish.features || []).includes(
                        feature.id
                      ),
                    }"
                    class="p-2 hover:bg-gray-100 cursor-pointer font-medium"
                  >
                    {{ feature.name }}
                  </li>
                </ul>
              </div>
              <div v-if="errors.features_wish" class="invalid-feedback">
                {{ errors.features_wish }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full md:w-2/5 hidden lg:flex items-start md:pl-6">
      <img
        :src="image"
        :alt="$t('form.stepImageAlt')"
        class="w-10/12 h-auto rounded"
      />
    </div>
  </div>
</template>

<script>
import { getHouseTypes, getHouseFeatures } from "@/services/apiService";

export default {
  props: ["formData", "image", "errors"],
  data() {
    return {
      houseTypes: [],
      features: [],
      selectedHouseTypeName: "",
      selectedFeatureNames: "",
      numberOfRooms: [1, 2, 3, 4, 5, 6],
      floorOptions: [0, 1, 2, 3, 4, 5, 6], // G represented as 0
      areas: ["50", "75", "100", "125", "150", "175", "200"],
      selectedCities: [],
      // showDropdown: false,
      // showAreaDropdown: false,
      // showFeaturesDropdown: false,
      showHouseTypeDropdown: false, // For house type dropdown
      showAreaDropdown: false, // For area dropdown
      showFeaturesDropdown: false, // For features dropdown
    };
  },
  methods: {
    // toggleDropdown(dropdown) {
    //   if (dropdown === "showDropdown") {
    //     this.showDropdown = !this.showDropdown;
    //     this.showAreaDropdown = false;
    //     this.showFeaturesDropdown = false;
    //   } else if (dropdown === "showAreaDropdown") {
    //     this.showAreaDropdown = !this.showAreaDropdown;
    //     this.showDropdown = false;
    //     this.showFeaturesDropdown = false;
    //   } else if (dropdown === "showFeaturesDropdown") {
    //     this.showFeaturesDropdown = !this.showFeaturesDropdown;
    //     this.showDropdown = false;
    //     this.showAreaDropdown = false;
    //   }
    // },
    toggleDropdown(dropdown) {
      if (dropdown === "houseType") {
        this.showHouseTypeDropdown = !this.showHouseTypeDropdown;
        this.showAreaDropdown = false;
        this.showFeaturesDropdown = false;
      } else if (dropdown === "area") {
        this.showAreaDropdown = !this.showAreaDropdown;
        this.showHouseTypeDropdown = false;
        this.showFeaturesDropdown = false;
      } else if (dropdown === "features") {
        this.showFeaturesDropdown = !this.showFeaturesDropdown;
        this.showHouseTypeDropdown = false;
        this.showAreaDropdown = false;
      }
    },
    clearError(field) {
      if (this.errors.step1 && this.errors.step1[field]) {
        delete this.errors.step1[field]; // Remove the error for the specific field
      }
    },
    selectHouseType(type) {
      this.formData.wish.house_type_id = type.id;
      this.selectedHouseTypeName = type.type;
      // this.showDropdown = false;
      this.showHouseTypeDropdown = false;
    },
    selectNumberOfRooms(number) {
      this.formData.wish.number_of_rooms = number;
    },
    selectFloor(floor) {
      this.formData.wish.floor_number = floor;
    },
    selectArea(area) {
      this.formData.wish.area = area;
      this.showAreaDropdown = false;
    },
    toggleFeature(feature) {
      const index = (this.formData.wish.features || []).indexOf(feature.id);
      if (index > -1) {
        this.formData.wish.features.splice(index, 1);
      } else {
        this.formData.wish.features.push(feature.id);
      }
      this.updateSelectedFeatureNames();
    },
    updateSelectedFeatureNames() {
      this.selectedFeatureNames = (this.formData.wish.features || [])
        .map((id) => {
          const feature = this.features.find((f) => f.id === id);
          return feature ? feature.name : "";
        })
        .join(", ");
    },
    removeCity(city) {
      this.selectedCities = this.selectedCities.filter((c) => c !== city);
      this.formData.wish.locations = this.selectedCities;
    },
    roomClasses(number) {
      return {
        "bg-white": this.formData.wish.number_of_rooms === number,
        "text-[#1c592f]": this.formData.wish.number_of_rooms === number,
        "hover:bg-white": true,
        "hover:shadow-[0_0_10px_#1c592f]": true,
        "hover:text-[#1c592f]": true,
        "border-gray-300": true,
        "hover:border-[#1c592f]": true,
        transition: true,
        "duration-300": true,
        "ease-in-out": true,
        "selected-room": this.formData.wish.number_of_rooms === number,
      };
    },
    floorClasses(floor) {
      return {
        "bg-white": this.formData.wish.floor_number === floor,
        "text-[#1c592f]": this.formData.wish.floor_number === floor,
        "hover:bg-white": true,
        "hover:shadow-[0_0_10px_#1c592f]": true,
        "hover:text-[#1c592f]": true,
        "border-gray-300": true,
        "hover:border-[#1c592f]": true,
        transition: true,
        "duration-300": true,
        "ease-in-out": true,
        "selected-room": this.formData.wish.floor_number === floor,
      };
    },
    handleClickOutside(event) {
      const houseTypeDropdown = this.$refs.houseTypeDropdown;
      const areaDropdown = this.$refs.areaDropdown;
      const featuresDropdown = this.$refs.featuresDropdown;

      if (houseTypeDropdown && !houseTypeDropdown.contains(event.target)) {
        // this.showDropdown = false;
        this.showHouseTypeDropdown = false;
      }
      if (areaDropdown && !areaDropdown.contains(event.target)) {
        this.showAreaDropdown = false;
      }
      if (featuresDropdown && !featuresDropdown.contains(event.target)) {
        this.showFeaturesDropdown = false;
      }
    },
    initAutocomplete() {
      const input = document.getElementById("interestsAutocompleteInput");
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["(cities)"],
        componentRestrictions: { country: "NL" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.address_components) {
          const city = place.address_components[0].long_name;
          if (!this.selectedCities.includes(city)) {
            this.selectedCities.push(city);
            this.formData.wish.locations = this.selectedCities;
            input.value = "";
          }
        }
      });
    },
    loadGoogleMapsScript() {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.onload = this.initAutocomplete;
      document.head.appendChild(script);
    },
    async loadHouseTypes() {
      try {
        const response = await getHouseTypes();
        if (response.success) {
          this.houseTypes = response.result;
        } else {
          console.error("Failed to load house types:", response.message);
        }
      } catch (error) {
        console.error("Error loading house types:", error);
      }
    },
    async loadHouseFeatures() {
      try {
        const response = await getHouseFeatures();
        if (response.success) {
          this.features = response.result.map((feature) => ({
            id: feature.id,
            name: feature.name,
          }));
        } else {
          console.error("Failed to load house features:", response.message);
        }
      } catch (error) {
        console.error("Error loading house features:", error);
      }
    },
  },
  mounted() {
    this.loadGoogleMapsScript();
    this.loadHouseTypes();
    this.loadHouseFeatures();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.input-field {
  @apply w-full p-2 border border-gray-300 rounded;
}
.input-field:focus {
  border-color: #1c592f;
  outline: none;
  box-shadow: 0 0 5px rgba(7, 169, 132, 0.5);
}
.tags-container {
  @apply mt-2 flex flex-wrap;
}
.no-gap-list li {
  margin: 0 !important;
}
.room-item {
  transition: all 0.3s ease-in-out;
}
.room-item:hover {
  box-shadow: 0 0 10px #1c592f;
  border-color: #1c592f;
}
.selected-room {
  background-color: white !important;
  color: #1c592f !important;
  box-shadow: 0 0 10px #1c592f !important;
  border-color: #1c592f !important;
}
.dropdown-content,
.multi-select-content {
  @apply absolute bg-white shadow-lg max-h-48 overflow-y-auto z-10 w-full mt-1 border border-gray-300 rounded;
}
.dropdown-content li,
.multi-select-content li {
  @apply cursor-pointer p-2 hover:bg-gray-100;
}
.invalid-feedback {
  @apply text-red-600 text-sm;
}
.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #1c592f; /* Match your theme color */
  transition: transform 0.3s ease;
}

.dropdown-icon.open svg {
  transform: rotate(180deg); /* Rotate the arrow up */
}
.border-red-500 {
  border-color: red;
}
</style>
