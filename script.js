$(function () {
  $("#getStartedForm")
    .parsley()
    .on("form:submit", function () {
      const form = document.getElementById("getStartedForm");

      // Check if the form is valid according to Parsley
      if ($(form).parsley().isValid()) {
        // Verify reCAPTCHA response
        const recaptchaResponse = grecaptcha.getResponse();

        if (recaptchaResponse === "") {
          // reCAPTCHA not completed, show an error message or take appropriate action
          //alert("Please complete the reCAPTCHA.");
          const recaptchaField = $("#recaptcha-field"); // Replace with the actual field ID
          recaptchaField.parsley().addError('custom', {
            message: 'Please complete the reCAPTCHA.',
            updateClass: true,
          });
          // Insert the error message into the recaptcha-field
          recaptchaField.append('<div class="error-message">Please complete the reCAPTCHA.</div>');
          return false; // Prevent form submission
        }

        // Continue with form submission
        const formData = new FormData(form);
        const submitButton = $("#submitFormButton");
        const loader = $("#loader");

        // Show loader and hide submit button text
        submitButton.prop("disabled", true); // Disable the button
        loader.removeClass("d-none").addClass("d-inline-block");

        // Include the reCAPTCHA response in the form data
        formData.append("recaptcha_response", recaptchaResponse);

        // Send form data using fetch and ES6 arrow functions
        fetch("initial_quote.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((data) => {
            // Hide loader and show submit button text
            submitButton.prop("disabled", false); // Enable the button again
            loader.removeClass("d-inline-block").addClass("d-none");
            // Store form data in local storage
            localStorage.setItem("formData", JSON.stringify(formData));

            // Redirect to the getquote.php page
            // window.location.href = "https://boilerquote.000webhostapp.com/offer-page?utm_source=meraboiler"; // Replace with the actual URL
            window.location.href = "quote";
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      return false; // Don't submit form for this demo
    });
});

(function() {
  const obfuscatedFunc = function() {
    $(window).on("load", function() {
      $(".dtr-preloader").delay(200).fadeOut(250);
    });

    $(document).ready(function() {
      const w = $(window);
      const h = $(".header-wrap");

      w.on("scroll", function() {
        const s = w.scrollTop();
        if (s < 100) {
          h.removeClass("sticky");
        } else {
          h.addClass("sticky");
        }
      });

      $('[data-owl-slider]').each(function() {
        const slider = $(this);
        slider.owlCarousel({
          nav: false,
          dots: true,
          loop: true,
          navText: [
            '<i class="fa fa-arrow-left"></i>',
            '<i class="fa fa-arrow-right"></i>',
          ],
          margin: 0,
          items: 1,
          thumbs: false,
          smartSpeed: 1300,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true,
          responsiveClass: true,
          autoHeight: false,
        });
      });

      const owlSettings = [
        { selector: ".service-slider-one", items: [1, 2, 4] },
        { selector: ".quick-slider", items: [1, 3, 4] },
        { selector: ".product-slider", items: [1, 2, 3] },
        { selector: ".partner-slider-one", items: [2, 3, 4] },
        { selector: ".promo-slider", items: [1, 2, 3] },
      ];

      owlSettings.forEach(setting => {
        $(setting.selector).owlCarousel({
          nav: false,
          dots: false,
          loop: setting.selector !== ".quick-slider",
          margin: 25,
          items: 1,
          thumbs: false,
          smartSpeed: 1300,
          autoplay: true,
          autoplayTimeout: 5500,
          autoplayHoverPause: true,
          responsiveClass: true,
          autoHeight: false,
          responsive: {
            0: { items: setting.items[0] },
            768: { items: setting.items[1] },
            1200: { items: setting.items[2] },
          },
        });
      });

      if (window.location.pathname.endsWith("thankyou.php")) {
        const countdownElement = $("#countdown");
        let countdown = 3;
        (function countdownFunc() {
          countdownElement.text(countdown);
          countdown--;
          if (countdown < 0) {
            window.location.href = "index.php";
          } else {
            setTimeout(countdownFunc, 1000);
          }
        })();
      }
    });

    $(document).ready(function() {
      function validatePhoneNumber(phoneNumber) {
        phoneNumber = phoneNumber.replace(/\D/g, '');
        if (phoneNumber.length !== 10 && phoneNumber.length !== 11) {
          $("#phone").siblings(".invalid-feedback").text("Please enter a valid phone number with 10 or 11 digits.");
          $("#phone").addClass("is-invalid");
          return false;
        }
        $("#phone").removeClass("is-invalid");
        $("#phone").siblings(".invalid-feedback").text("");
        return true;
      }

      $("#contactForm").on("submit", function(e) {
        e.preventDefault();
        if (!$("select[name='contact_service_subject']").val()) {
          alert("Please select a reason for contact.");
          return;
        }
        const formData = $(this).serialize();
        const phoneNumber = $("#phone").val().trim();
        if (!validatePhoneNumber(phoneNumber)) {
          return;
        }
        $("#contactSubmitBtn").prop("disabled", true);
        $("#loader").removeClass("d-none");
        $.ajax({
          type: "POST",
          url: "generalContactMail.php",
          data: formData,
          success: function(response) {
            alert('Thanks for Contacting Us. We will be in touch with you');
            window.location.href = "/";
          },
          error: function() {
            alert('An error occurred while sending the message.');
          },
          complete: function() {
            $("#contactSubmitBtn").prop("disabled", false);
            $("#loader").addClass("d-none");
          },
        });
      });
    });

    $(document).ready(function() {
      let totalSteps = 0;
      for (let i = 1; ; i++) {
        const elementId = `step-${i}`;
        const stepElement = $(`#${elementId}`);
        if (stepElement.length === 0) {
          break;
        }
        totalSteps++;
        const navLink = `<li class="nav-item"><a class="nav-link" href="#${elementId}"><span class="num">${i}</span></a></li>`;
        $("#step-navigation").append(navLink);
      }

      $("#smartwizard").smartWizard({
        selected: 0,
        autoAdjustHeight: false,
        enableAllSteps: true,
        transitionEffect: "fade",
        transitionSpeed: "400",
        easing: "easeInOutExpo",
        enableUrlHash: false,
        theme: "dots",
        backButtonSupport: true,
        toolbarSettings: {
          toolbarPosition: "bottom",
          showNextButton: false,
        },
        onLeaveStep: function(anchorObject, stepIndex, stepDirection) {
          $('.dtr-btn[name="quote_submit"]').prop("disabled", true);
          if (stepIndex === totalSteps - 1) {
            $('.dtr-btn[name="quote_submit"]').prop("disabled", false);
          }
          return true;
        },
      });

      $("#smartwizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
        if (stepNumber === 0) {
          $(".sw-btn-prev").hide();
        } else {
          $(".sw-btn-prev").show();
        }
      });

      for (let i = 1; i <= 18; i++) {
        $(`input[name="q${i}"], select[name="q${i}"]`).on("change", function() {
          const currentStepContent = $(`#step-${i}`);
          currentStepContent.fadeOut(400, function() {
            $("#smartwizard").smartWizard("next");
            const nextStepContent = $(`#step-${i + 1}`);
            nextStepContent.fadeIn(400);
          });
        });
      }

      $("#quote-form").on("submit", function(e) {
        e.preventDefault();
        if ($("#quote-form").parsley().isValid()) {
          const submitButton = $('.btn-quote[name="quote_submit"]');
          submitButton.prop("disabled", true);
          $("#loader").css("display", "inline-block");
          const dynamicURL = $("#formAction").val();
          $.ajax({
            type: "POST",
            url: dynamicURL,
            data: $("#quote-form").serialize(),
            dataType: "json",
            success: function(response) {
              $("#loader").hide();
              submitButton.prop("disabled", false);
              if (response.status === "success") {
                alert(response.message);
                window.location.href = "/";
              } else {
                alert(response.message);
              }
            },
            error: function(error) {
              console.error(error);
              $("#loader").hide();
              submitButton.prop("disabled", false);
              alert("Form submission failed. Please try again.");
            },
          });
        }
      });
    });

    const postcodeInput = document.getElementById("postcode");
    const addressSelect = document.getElementById("addressSelect");
    const manualAddressInput = document.getElementById("manualAddressInput");

    postcodeInput.addEventListener("input", () => {
      $(postcodeInput).parsley().validate();
      if ($(postcodeInput).parsley().isValid()) {
        const inputPostcode = postcodeInput.value.replace(/\s+/g, "").toUpperCase();
        fetchAddressSuggestions(inputPostcode);
      } else {
        clearAddressSuggestions();
      }
    });

    async function fetchAddressSuggestions(postcode) {
      try {
        const response = await fetch(`includes/ideal_postcodes_api.php?postcode=${encodeURIComponent(postcode)}`);
        if (response.ok) {
          const data = await response.json();
          const addressSuggestions = data.result;
          if (addressSuggestions && addressSuggestions.length > 0) {
            addressSelect.style.display = "block";
            manualAddressInput.style.display = "none";
            addressSelect.setAttribute("data-parsley-excluded", false);
            manualAddressInput.setAttribute("data-parsley-excluded", true);
            addressSelect.innerHTML = "<option value=''>Select your address</option>";
            addressSuggestions.forEach(address => {
              const option = document.createElement("option");
              option.value = address.line_1;
              option.textContent = `${address.line_1}, ${address.line_2}, ${address.post_town}, ${address.postcode}`;
              addressSelect.appendChild(option);
            });
          } else {
            addressSelect.style.display = "none";
            manualAddressInput.style.display = "block";
            addressSelect.setAttribute("data-parsley-excluded", true);
            manualAddressInput.setAttribute("data-parsley-excluded", false);
          }
        } else {
          console.error("Error fetching address suggestions:", response.statusText);
          addressSelect.style.display = "none";
          manualAddressInput.style.display = "block";
          addressSelect.setAttribute("data-parsley-excluded", true);
          manualAddressInput.setAttribute("data-parsley-excluded", false);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        addressSelect.style.display = "none";
        manualAddressInput.style.display = "block";
        addressSelect.setAttribute("data-parsley-excluded", true);
        manualAddressInput.setAttribute("data-parsley-excluded", false);
      }
    }

    function clearAddressSuggestions() {
      addressSelect.innerHTML = "<option value=''>Select your address</option>";
      addressSelect.style.display = "none";
      manualAddressInput.style.display = "block";
      addressSelect.setAttribute("data-parsley-excluded", true);
      manualAddressInput.setAttribute("data-parsley-excluded", false);
    }
  };

  obfuscatedFunc();
})();
