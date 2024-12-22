(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var category_swiper = new Swiper(".category-carousel", {
      slidesPerView: 8,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 5,
        },
        1500: {
          slidesPerView: 8,
        },
      }
    });

    $(".products-carousel").each(function(){
      var $el_id = $(this).attr('id');

      var products_swiper = new Swiper("#"+$el_id+" .swiper", {
        slidesPerView: 5,
        spaceBetween: 30,
        speed: 500,
        navigation: {
          nextEl: "#"+$el_id+" .products-carousel-next",
          prevEl: "#"+$el_id+" .products-carousel-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 3,
          },
          991: {
            slidesPerView: 4,
          },
          1500: {
            slidesPerView: 5,
          },
        }
      });

    });


    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
      slidesPerView: 5,
      spaceBetween: 20,
      // autoplay: true,
      direction: "vertical",
      breakpoints: {
        0: {
          direction: "horizontal"
        },
        992: {
          direction: "vertical"
        },
      },
    });

    var large_slider = new Swiper(".product-large-slider", {
      slidesPerView: 1,
      // autoplay: true,
      spaceBetween: 0,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // input spinner
  var initProductQty = function(){

    $('.product-qty').each(function(){
      
      var $el_product = $(this);
      var quantity = 0;
      
      $el_product.find('.quantity-right-plus').click(function(e){
        e.preventDefault();
        quantity = parseInt($el_product.find('#quantity').val());
        $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
        e.preventDefault();
        quantity = parseInt($el_product.find('#quantity').val());
        if(quantity>0){
          $el_product.find('#quantity').val(quantity - 1);
        }
      });

    });

  }

  // Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Select the search input field (assuming there's only one in the header)
  const searchInput = document.querySelector("#search-form input");

  // Select all product items in the "pb-5" section
  const productItems = document.querySelectorAll("#pb-5 .product-item");

  // Add an event listener to the search bar
  searchInput.addEventListener("input", function (e) {
    const searchValue = e.target.value.trim().toLowerCase(); // Get search value and normalize

    // Filter the products based on the search value
    let foundMatch = false;
    productItems.forEach((item) => {
      const productTitle = item.querySelector("h3").textContent.toLowerCase(); // Get product title
      if (productTitle.includes(searchValue)) {
        item.style.display = ""; // Show matching items
        foundMatch = true; // Flag to indicate at least one match is found
      } else {
        item.style.display = "none"; // Hide non-matching items
      }
    });

    
    if (foundMatch && searchValue !== "") {
      document.querySelector("#pb-5").scrollIntoView({ behavior: "smooth" });
    }
  });
});


let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add event listener to "Add to Cart" buttons
document.addEventListener("click", (event) => {
  if (event.target.closest(".btn-cart")) {
    event.preventDefault();
    const productItem = event.target.closest(".product-item");
    addToCart(productItem);
  }
});

function addToCart(productItem) {
  const productId = productItem.getAttribute("data-product-id");
  const productName = productItem.getAttribute("data-product-name");
  const productPrice = parseFloat(productItem.getAttribute("data-product-price"));
  const quantity = parseInt(productItem.querySelector(".quantity").value);

  // Check if the product already exists in the cart
  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity; 
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: quantity,
    });
  }

 
  showMessage(quantity, productName);

  updateCartUI();
  saveCartToLocalStorage();
}

function updateCartUI() {
  const cartList = document.querySelector("#offcanvasCart .list-group");
  const cartBadge = document.querySelector("#offcanvasCart .badge");
  const totalAmountElement = document.querySelector("#offcanvasCart .list-group-item:last-child strong");

  cartList.innerHTML = ""; 

  let totalAmount = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const cartItemHTML = `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0">${item.name}</h6>
          <small class="text-body-secondary">Quantity: ${item.quantity}</small>
        </div>
        <span class="text-body-secondary">₹${itemTotal.toFixed(2)}</span>
      </li>
    `;

    cartList.insertAdjacentHTML("beforeend", cartItemHTML);
  });


  totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;

 
  cartBadge.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}


function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function showMessage(quantity, productName) {
  const messageBox = document.createElement("div");
  messageBox.textContent = `${quantity} ${productName} added to your cart`;
  messageBox.style.position = "fixed";
  messageBox.style.top = "50px";
  messageBox.style.right = "10px";
  messageBox.style.backgroundColor = "red";
  messageBox.style.color = "white";
  messageBox.style.padding = "10px";
  messageBox.style.borderRadius = "5px";
  messageBox.style.zIndex = "9999";
  document.body.appendChild(messageBox);

  setTimeout(() => {
    document.body.removeChild(messageBox);
  }, 2000);
}


document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});

document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.clients-swiper', {
    autoplay: {
      loop: true,  
      delay: 2000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: '.products-carousel-next',
      prevEl: '.products-carousel-prev',
    },
    slidesPerView: 4,
    spaceBetween: 15,
    breakpoints: {
      768: { 
        slidesPerView: 3,
        spaceBetween: 10,
      },
      576: { 
        slidesPerView: 2,
        spaceBetween: 10,
      },
      320: { 
        slidesPerView: 1,
        spaceBetween: 5,
      },
    },
  });
});

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('packagingRequestForm');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      
      // Gather form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Simulate submission (replace with actual logic)
      console.log('Form Submitted:', data);
      
      // Provide feedback to the user
      alert('Your request has been submitted. We will contact you shortly!');
      
      // Clear form
      form.reset();
    });
  });



function toggleChatbot() {
  const chatbotBox = document.getElementById("chatbotBox");
  chatbotBox.style.display = chatbotBox.style.display === "none" ? "flex" : "none";
}

function sendMessage() {
  const userInput = document.getElementById("userInput");
  const message = userInput.value.toLowerCase(); 
  const messageContainer = document.getElementById("chatbotMessages");

  if (message.trim()) {
      messageContainer.innerHTML += `<p><strong>You:</strong> ${userInput.value}</p>`;
      userInput.value = "";

      setTimeout(() => {
          let botResponse = "";

          
          if (message.includes("your name") || message.includes("who are you")) {
              botResponse = "I am the Kanak Print-N-Pack chatbot. How can I assist you?";
          } else if (message.includes("what is kanak print") || message.includes("explain the company") || message.includes("about kanak")) {
              botResponse = "Kanak Print-N-Pack is a leading packaging solutions provider since 1998. We specialize in custom packaging solutions for businesses.";
          } else if (message.includes("website") || message.includes("about this website") || message.includes("site")) {
              botResponse = "This website showcases our packaging products and services. You can explore our catalog and get in touch for custom packaging solutions.";
          } else if (message.includes("contact") || message.includes("how can i contact you") || message.includes("reach you") || message.includes("query")) {
              botResponse = "You can reach us at kanakprints1@gmail.com or call us at +91 9079122944. We're here to help with all your packaging needs!";
          } else if (message.includes("services") || message.includes("what services do you offer")) {
              botResponse = "We offer a wide range of packaging solutions including custom boxes, labels, eco-friendly packaging, and more.";
          } else if (message.includes("location") || message.includes("where are you located")) {
              botResponse = "Our headquarters are located in Marine Lines,Mumbai, India, and we serve clients nationally.";
          } else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
              botResponse = "Hello! How can I assist you today?";
          } else if (message.includes("thank you") || message.includes("thanks")||message.includes("ok")) {
              botResponse = "You're welcome! Feel free to ask if you have more questions.";
          } else if (message.includes("bye") || message.includes("goodbye")) {
              botResponse = "Goodbye! Have a great day! Feel free to reach out whenever you have more questions.";
          } else if (message.includes("how are you") || message.includes("how do you do")) {
              botResponse = "I am perfectly fine. Tell me how can I assist you.";
    }else if (message.includes("what all things can you do") || message.includes("what will you do")) {
              botResponse = "I will assist you in understanding the websites,explore product catalogs and reach to the company";
    }else if (message.includes("products") || message.includes("explore")) {
              botResponse = "We, at Kanak Print-N-Pack offer a wide range of products like sheets,Bopp Bags,etc. You can browse for more products in the 'Products' section of this website.";
    }
    else {
              
              botResponse = "Thank you for your message! I'm still learning and currently trained to respond to a limited set of queries. Please try again or contact us directly for further assistance.";
          }

          // Display bot response
          messageContainer.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
          messageContainer.scrollTop = messageContainer.scrollHeight; 
      }, 1000); 
  }
}

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  
  $(document).ready(function() {
    
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();

  });

  

})(jQuery);