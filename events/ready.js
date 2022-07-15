const ready = {
  name: "ready",
  once: true,
  execute() {
    console.log("CLIENT_READY");
  },
};
export default ready;
