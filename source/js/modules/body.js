export default () => {
  document.addEventListener("DOMContentLoaded", function () {
    let body = document.querySelector("body");
    body.classList.add("page-loaded");
  });
};
