(function () {
  function getSuccessUrl() {
    return new URL("contact-success.html", window.location.href).href;
  }

  function setDynamicNext(form) {
    var nextInput = form.querySelector('input[name="_next"]');
    if (!nextInput) return;
    nextInput.value = getSuccessUrl();
  }

  function setSubmittingState(form, isSubmitting) {
    var submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    if (isSubmitting) {
      submitButton.setAttribute("aria-busy", "true");
    } else {
      submitButton.removeAttribute("aria-busy");
    }
  }

  async function handleSubmit(event) {
    var form = event.currentTarget;
    event.preventDefault();

    setSubmittingState(form, true);
    setDynamicNext(form);

    var formData = new FormData(form);
    var targetUrl = String(formData.get("_next") || getSuccessUrl());

    try {
      var response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Formspree submission failed");
      }

      window.location.assign(targetUrl);
    } catch (error) {
      setSubmittingState(form, false);
      form.submit();
    }
  }

  function init() {
    var form = document.querySelector(".contact-form");
    if (!form) return;
    setDynamicNext(form);
    form.addEventListener("submit", handleSubmit);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
