

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", 
      (event) => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("taxToggle");

    if(!toggle) return;

    toggle.addEventListener("change", function () {

        let prices = document.querySelectorAll(".price-value");

        prices.forEach(price => {
            let base = parseInt(price.dataset.base);

            if (this.checked) {
                let total = Math.round(base * 1.18);
                price.innerText = "₹ " + total.toLocaleString("en-IN");
            } else {
                price.innerText = "₹ " + base.toLocaleString("en-IN");
            }
        });

    });
});