<template>
  <div class="wrapper">
    <section class="open-book cslider">
      <section class="book-inner" :style="`background: url(${backgroundImage}) 0% 0% / contain no-repeat`">
        <img :src="`${IPFS_NODE}/${hero.nid}`" class="hero-img" />
        <header>
          <h1 class="book-title">
            <span class="title-blur">{{ hero.name }}</span>
            {{ hero.name }}
          </h1>
          <h1 class="book-title">
            <span class="title-blur">{{ chapter }}</span>
            {{ chapter }}
          </h1>
        </header>
        <div class="d-flex">
          <article>
            <div>
              <p class="book-paragraph">{{ textPage1 }}</p>
              <p class="paragraph-blur">{{ textPage1 }}</p>
            </div>
          </article>
          <article>
            <div>
              <p class="book-paragraph">{{ textPage2 }}</p>
              <p class="paragraph-blur">{{ textPage2 }}</p>
            </div>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { Data } from './+data';
import { IPFS_NODE } from '../+config';

const { hero, chapter, textPage1, textPage2, backgroundImage } = useData<Data>();
</script>

<style scoped>
@import './book.css';

.wrapper {
  margin: auto;
  max-width: 1084px;
}

.hero-img {
  width: 142px;
  margin-bottom: -150px;
}
.book-hero {
  display: block;
  font-size: 20px;
  max-width: calc(50% + 10px);
}
.title-blur {
  display: block;
  margin-bottom: -24px;
  background: rgba(0, 0, 0, 0.2);
  filter: blur(7px);
  z-index: -1;
  color: rgba(255,255,255,0.5);
}
.d-flex {
  display: flex;
}
.book-paragraph {
  font-size: 20px;
  vertical-align: bottom;
  position: absolute;
  bottom: 0px;
  z-index: 9;
}
.paragraph-blur {
  filter: blur(7px);
  font-size: 20px;
  vertical-align: bottom;
  position: absolute;
  bottom: 0px;
  color: rgba(0, 0, 0, 0);
  background: rgba(0, 0, 0, 0.3);
}
</style>
