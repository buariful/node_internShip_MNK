const menuItemClick = () => {
  console.log(document.querySelectorAll("#left_side_menu button"));

  document.addEventListener("DOMContentLoaded", function () {
    const leftMenuButtons = document.querySelectorAll("#left_side_menu button");

    leftMenuButtons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.add("text-red-500");
        const componentName = this.textContent.toLowerCase();
        fetch(`/components/${componentName}.ejs`)
          .then((response) => response.text())
          .then((data) => {
            document.getElementById("right_sub_menu").innerHTML = data;
          })
          .catch((error) => console.error("Error fetching component:", error));
      });
    });
  });
};
