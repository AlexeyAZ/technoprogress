// require("babel-polyfill");

const app = {

	load: () => {
		app.bindEvents();
	},

	bindEvents: () => {
		var menuBtn = document.querySelector(".js-open-menu");

		menuBtn.addEventListener("click", function() {
			toggleMenu({btn:this});
		});
		
		function toggleMenu(options) {
			var btn = options.btn;
			var state = options.state;
		
			if (state) {
				
				if (state === false) {
					close();
				} else {
					open();
				}
			} else {
		
				if (btn.classList.contains("header__menu-btn_active")) {
					close();
				} else {
					open();
				}
			}
			
			function close() {
				btn.classList.remove("header__menu-btn_active");
				document.body.classList.remove("menu-open");
			}
		
			function open() {
				btn.classList.add("header__menu-btn_active");
				document.body.classList.add("menu-open");

				var content = document.querySelector(".content");
				content.addEventListener("transitionend", setContentPosition);
				
				function setContentPosition() {
					//content.style.transform = "translateX(0)";
					content.removeEventListener("transitionend", setContentPosition);
				}
			}

			window.addEventListener("resize", function() {

				toggleMenu({btn: menuBtn, state: false});
			});
		}

		var map;
		var styles = [
			{
				"featureType": "all",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"saturation": 36
					},
					{
						"color": "#000000"
					},
					{
						"lightness": 40
					}
				]
			},
			{
				"featureType": "all",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"visibility": "on"
					},
					{
						"color": "#000000"
					},
					{
						"lightness": 16
					}
				]
			},
			{
				"featureType": "all",
				"elementType": "labels.icon",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 20
					}
				]
			},
			{
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 17
					},
					{
						"weight": 1.2
					}
				]
			},
			{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 20
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 21
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 17
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 29
					},
					{
						"weight": 0.2
					}
				]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 18
					}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 16
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 19
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#000000"
					},
					{
						"lightness": 17
					}
				]
			}
		];
		var mapCenter = {lat: 55.632449, lng: 37.430355};

		initMap(".contacts");
		
		function initMap(page) {

			if (document.querySelector(page)) {

				map = new google.maps.Map(document.querySelector('.content__map'), {
					center: mapCenter,
					zoom: 16,
					styles: styles,
					disableDefaultUI: true
				});

				var marker = new google.maps.Marker({
					position: mapCenter,
					map: map
				});
			}
		}

		var mySwiper;
		mySwiper = new Swiper ('.swiper-container', {
			slidesPerView: 4,
			nextButton: '.gallery__arrow_right',
			prevButton: '.gallery__arrow_left',
			pagination: '.swiper-pagination',
			spaceBetween: 30,
			//autoHeight: true,
			//paginationType: "fraction"
			slidesPerGroup: 4,
			paginationClickable: true,
			onInit: function(swiper) {
				setContentWidth(this);
			},

			onAfterResize: function() {
				setContentWidth(this);
			},

			breakpoints: {
				480: {
					slidesPerView: "auto",
					slidesPerGroup: 1,
				},
				768: {
					slidesPerView: 2,
					slidesPerGroup: 2,
				},
				1024: {
					slidesPerView: 2,
					slidesPerGroup: 2,
				},
				1366: {
					slidesPerView: 2,
					slidesPerGroup: 2,
				}
			}
			
		});

		function setContentWidth(swiper) {
			var wrapper = swiper.wrapperClass;
			var wrapperEl = document.querySelector("." + wrapper);
			var slides = wrapperEl.querySelectorAll(".gallery__slide");

			for (var i = 0; i < slides.length; i++) {
				var slide = slides[i];
				var img = slide.querySelector(".gallery__img");
				var descr = slide.querySelector(".gallery__descr");

				var imgWidth = img.clientWidth;

				descr.style.width = imgWidth + "px";
			}
		}
		
		var navLinks = document.querySelectorAll(".js-nav-link");
		var transEl = document.querySelector(".page-transition");

		setTimeout(function() {
			document.body.classList.remove("trans_exit");
		}, 500);

		for (var i = 0; i < navLinks.length; i++) {
			var navLink = navLinks[i];

			navLink.addEventListener("click", function(e) {
				e.preventDefault();

				if (window.matchMedia("(max-width: 1024px)").matches) {
					document.querySelector(".header").style.opacity = "0";
				}

				if (this.tagName === "A") {
					openLink(this);
				}
			});
		}

		function openLink(el) {
			var link = el.getAttribute("href");

			document.body.classList.add("trans_exit");
			transEl.addEventListener("transitionend", function() {
				animClose(link);
			});
		}
		
		function animClose(link) {
			window.location = link;
		}
	}
}

window.addEventListener("load", app.load);

