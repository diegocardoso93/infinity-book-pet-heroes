<template>
  <div style="margin: auto;max-width: 1084px;">
    <div id="wrapper">
      <section class="open-book cslider">
        <section class="book-inner" :style="`background: url(${backgroundImage}) 0% 0% / contain no-repeat`">
          <img :src="`${BASE_NODE}/${hero.nid}`" style="width: 142px; margin-bottom: -150px;" />
          <header>
            <h1 style="display: block;font-size: 20px;max-width: calc(50% + 10px);">
              <span style="display: block;margin-bottom: -24px;background: rgba(0, 0, 0, 0.2);filter: blur(7px);z-index: -1;color: rgba(255,255,255,0.5);">
                {{ hero.name }}
              </span>
              {{ hero.name }}
            </h1>
            <h1 style="display: block;font-size: 20px;max-width: calc(50% + 10px);">
              <span style="display: block;margin-bottom: -24px;background: rgba(0, 0, 0, 0.2);filter: blur(7px);z-index: -1;color: rgba(255,255,255,0.5);">
                {{ chapter }}
              </span>
              {{ chapter }}
            </h1>
          </header>
          <div style="display: flex">
            <article>
              <div>
                <p style="font-size: 20px;vertical-align: bottom;position: absolute;bottom: 0px;z-index: 9;">{{ textPage1 }}</p>
                <p style="filter: blur(7px);font-size: 20px;vertical-align: bottom;position: absolute;bottom: 0px;color: rgba(0, 0, 0, 0);background: rgba(0, 0, 0, 0.3);">
                  {{ textPage1 }}
                </p>
              </div>
            </article>
            <article>
              <div>
                <p style="font-size: 20px;vertical-align: bottom;position: absolute;bottom: 0px;z-index: 9;">{{ textPage2 }}</p>
                <p style="filter: blur(7px);font-size: 20px;vertical-align: bottom;position: absolute;bottom: 0px;color: rgba(0, 0, 0, 0);background: rgba(0, 0, 0, 0.3);">
                  {{ textPage2 }}
                </p>
              </div>
            </article>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { Data } from './+data';

const { hero, chapter, textPage1, textPage2, backgroundImage } = useData<Data>();
// console.log(backgroundImage);

const BASE_NODE = 'https://ipfs-pin.numbersprotocol.io/ipfs';

</script>

<style scoped>
@import './book.css';
</style>
