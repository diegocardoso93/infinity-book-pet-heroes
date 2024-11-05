import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
import Layout from "../layouts/LayoutDefault.vue";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "Infinity Book: Pet Heroes",
  description: "The community-driven infinity book with theme pet heroes. Every user can generate a new Chapter.",
  lang: 'en',

  extends: vikeVue as typeof vikeVue,
} satisfies Config;

export const IPFS_NODE = 'https://ipfs-pin.numbersprotocol.io/ipfs';
