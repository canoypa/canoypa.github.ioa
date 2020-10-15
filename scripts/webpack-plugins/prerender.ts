export default class PrerenderPlugin {
  apply(compiler: any) {
    compiler.plugin("done", () => {
      console.log("終了");
    });
  }
}
