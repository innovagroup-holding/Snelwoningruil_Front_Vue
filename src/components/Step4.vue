<template>
  <div class="flex flex-col md:flex-row justify-between h-full">
    <div class="w-full md:w-3/5 mb-6 md:mb-0 md:pr-6">
      <div class="text-center border-gray-300 py-2 mb-4">
        <h3 class="font-bold text-[#1c592f]">
          {{ $t("houseDescription.title") }}
        </h3>
      </div>

      <div class="mb-6">
        <div class="form-group mb-4">
          <h3 class="font-semibold text-[#1c592f] mb-2">
            {{ $t("houseDescription.description") }}
          </h3>
          <textarea
            v-model="formData.house_description"
            :placeholder="$t('houseDescription.descriptionPlaceholder')"
            class="input-field"
            rows="4"
            style="resize: none"
          ></textarea>
        </div>

        <div class="form-group mb-4">
          <h3 class="font-semibold text-[#1c592f] mb-2">
            {{ $t("houseDescription.gallery") }}
          </h3>
          <p class="mt-4">{{ $t("houseDescription.addPictures") }}</p>
          <input
            type="file"
            id="gallery"
            multiple
            class="input-field mt-4"
            @change="previewImages"
          />
          <div class="preview-container mt-4">
            <div
              class="preview-slideshow"
              id="previewSlideshow"
              :style="slideshowStyle"
            >
              <div
                v-for="(image, index) in images"
                :key="index"
                class="relative mr-4"
              >
                <img
                  :src="image"
                  :alt="$t('houseDescription.imageAlt')"
                  class="w-32 h-32 object-cover"
                />
                <button @click="removeImage(index)" class="remove-image">
                  &times;
                </button>
              </div>
            </div>
            <div class="preview-controls mt-2">
              <button
                @click="prevSlide"
                :disabled="currentSlide === 0"
                class="bg-gray-300 p-2 rounded-full mx-2"
              >
                &larr;
              </button>
              <button
                @click="nextSlide"
                :disabled="currentSlide >= images.length - 5"
                class="bg-gray-300 p-2 rounded-full mx-2"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full md:w-2/5 hidden lg:flex items-center justify-center md:pl-6"
    >
      <img
        :src="image"
        :alt="$t('houseDescription.stepImageAlt')"
        class="w-full h-auto rounded"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["formData", "image"],
  data() {
    return {
      images: [],
      currentSlide: 0,
    };
  },
  computed: {
    slideshowStyle() {
      return {
        transform: `translateX(-${this.currentSlide * 100}%)`,
      };
    },
  },
  methods: {
    previewImages(event) {
      const files = Array.from(event.target.files);
      this.images = files.map((file) => URL.createObjectURL(file));
      this.currentSlide = 0;
      this.updateFormDataImages(files);
    },
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },
    nextSlide() {
      if (this.currentSlide < this.images.length - 5) {
        this.currentSlide++;
      }
    },
    removeImage(index) {
      this.images.splice(index, 1);
      if (
        this.currentSlide >= this.images.length - 5 &&
        this.currentSlide > 0
      ) {
        this.currentSlide--;
      }
      this.updateFormDataImages();
    },
    updateFormDataImages(files = null) {
      const galleryInput = document.getElementById("gallery");
      if (files) {
        this.formData.gallery = files;
      } else {
        const dataTransfer = new DataTransfer();
        this.images.forEach((src, i) => {
          const file = galleryInput.files[i];
          dataTransfer.items.add(file);
        });
        galleryInput.files = dataTransfer.files;
        this.formData.gallery = galleryInput.files;
      }
    },
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
.preview-container {
  @apply flex flex-col items-center;
}
.preview-slideshow {
  @apply flex;
  transition: transform 0.5s ease;
}
.remove-image {
  @apply absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center;
}
.preview-controls {
  @apply flex mt-2;
}
</style>
