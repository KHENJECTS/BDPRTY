// Mendeklarasikan impor shader mentah (lihat aturan webpack di next.config.mjs).
declare module "*.glsl" {
  const content: string;
  export default content;
}
declare module "*.vert" {
  const content: string;
  export default content;
}
declare module "*.frag" {
  const content: string;
  export default content;
}
