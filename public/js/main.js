

document.addEventListener('DOMContentLoaded', function() {
  
  console.log('Patient Tracker loaded!');

  //  AUTO-DISMISS ALERTS AFTER 5 SECONDS
  
  
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach(function(alert) {
    setTimeout(function() {
      if (typeof bootstrap !== 'undefined' && bootstrap.Alert) {
        var bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      } else {
        alert.style.display = 'none';
      }
    }, 5000);
  });

  // DELETE CONFIRMATION

  
  const deleteForms = document.querySelectorAll('form[action*="DELETE"]');
  
  deleteForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      var confirmed = confirm('Are you sure you want to delete this?');
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });

 
  // FORM VALIDATION

  
  const forms = document.querySelectorAll('form');
  
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      var requiredInputs = form.querySelectorAll('[required]');
      var isValid = true;
      
      requiredInputs.forEach(function(input) {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields');
      }
    });
  });


  // CLEAR VALIDATION ON INPUT
  
  
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(function(input) {
    input.addEventListener('input', function() {
      this.classList.remove('is-invalid');
    });
  });

 
  //  IMAGE PREVIEW BEFORE UPLOAD

  
  const imageInputs = document.querySelectorAll('input[type="file"]');
  
  imageInputs.forEach(function(input) {
    input.addEventListener('change', function() {
      var file = this.files[0];
      
      if (file && file.type.startsWith('image/')) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
          var previewId = input.name + '-preview';
          var preview = document.getElementById(previewId);
          
          if (!preview) {
            preview = document.createElement('img');
            preview.id = previewId;
            preview.style.maxWidth = '200px';
            preview.style.maxHeight = '200px';
            preview.style.marginTop = '10px';
            preview.style.display = 'block';
            preview.style.borderRadius = '5px';
            input.parentNode.appendChild(preview);
          }
          
          preview.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
      }
    });
  });
  
  //  SMOOTH SCROLL TO TOP
 
  
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scroll-top-btn';
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;display:none;width:40px;height:40px;border:none;border-radius:50%;background:#667eea;color:white;font-size:20px;cursor:pointer;z-index:1000;';
  document.body.appendChild(scrollTopBtn);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });
  
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

}); 