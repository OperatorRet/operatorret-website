(function () {
  function setFormFeedback(form, message) {
    var feedback = form.querySelector('#contact-form-feedback');
    if (!feedback) return;

    if (message) {
      feedback.hidden = false;
      feedback.textContent = message;
    } else {
      feedback.hidden = true;
      feedback.textContent = '';
    }
  }

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

  function syncVenueAddressVisibility(form) {
    var sameCheckbox = form.querySelector('#venue-same-as-booker');
    var venueSection = form.querySelector('#venue-address-section');
    if (!sameCheckbox || !venueSection) return;

    var venueFields = venueSection.querySelectorAll('input, select, textarea');
    var isSame = sameCheckbox.checked;

    venueSection.hidden = isSame;
    venueFields.forEach(function (field) {
      field.disabled = isSame;
    });
  }

  function emailsMatch(form) {
    var emailInput = form.querySelector('#contact-email');
    var emailConfirmInput = form.querySelector('#contact-email-confirm');
    if (!emailInput || !emailConfirmInput) return true;

    var normalizedEmail = emailInput.value.trim().toLowerCase();
    var normalizedConfirm = emailConfirmInput.value.trim().toLowerCase();
    var isMatch = normalizedEmail !== '' && normalizedEmail === normalizedConfirm;

    if (!isMatch) {
      emailConfirmInput.setCustomValidity('Die E-Mail-Adressen stimmen nicht überein.');
      return false;
    }

    emailConfirmInput.setCustomValidity('');
    return true;
  }

  function hasTurnstileToken(form) {
    var tokenInput = form.querySelector('input[name="cf-turnstile-response"]');
    return Boolean(tokenInput && tokenInput.value && tokenInput.value.trim());
  }

  async function handleSubmit(event) {
    var form = event.currentTarget;
    event.preventDefault();

    setFormFeedback(form, '');

    if (!emailsMatch(form)) {
      setFormFeedback(form, 'Bitte prüfe deine E-Mail-Bestätigung.');
      form.reportValidity();
      return;
    }

    if (!hasTurnstileToken(form)) {
      setFormFeedback(form, 'Bitte bestätige zuerst das Captcha.');
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

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
      setFormFeedback(form, 'Senden per Hintergrund-Request fehlgeschlagen, es wird ein Standard-Submit versucht...');
      setSubmittingState(form, false);
      form.submit();
    }
  }

  function init() {
    var form = document.querySelector(".contact-form");
    if (!form) return;

    var sameCheckbox = form.querySelector('#venue-same-as-booker');
    var emailInput = form.querySelector('#contact-email');
    var emailConfirmInput = form.querySelector('#contact-email-confirm');

    if (sameCheckbox) {
      sameCheckbox.addEventListener('change', function () {
        syncVenueAddressVisibility(form);
      });
    }

    if (emailInput && emailConfirmInput) {
      var syncEmailValidity = function () {
        emailsMatch(form);
      };
      emailInput.addEventListener('input', syncEmailValidity);
      emailConfirmInput.addEventListener('input', syncEmailValidity);
      emailConfirmInput.addEventListener('blur', syncEmailValidity);
    }

    syncVenueAddressVisibility(form);
    setDynamicNext(form);
    form.addEventListener("submit", handleSubmit);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
