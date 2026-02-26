(function () {
	'use strict';

	var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function initHeaderState() {
		var header = document.getElementById('header');
		if (!header) return;

		function onScroll() {
			if (window.scrollY > 12) header.classList.add('is-compact');
			else header.classList.remove('is-compact');
		}

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	function initAnchorScroll() {
		if (prefersReducedMotion) return;

		document.addEventListener('click', function (event) {
			var anchor = event.target.closest && event.target.closest('a[href^="#"]');
			if (!anchor) return;

			var href = anchor.getAttribute('href');
			if (!href || href.length < 2) return;

			var target = document.querySelector(href);
			if (!target) return;

			event.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	}

	function initReveal() {
		if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

		var selectors = [
			'#main .major',
			'#main .image.main',
			'#main .row',
			'#main .actions',
			'#main p',
			'#main ul',
			'.tiles article',
			'#contact .contact-method'
		];

		var nodes = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));
		nodes.forEach(function (node) {
			if (node.closest && node.closest('#menu')) return;
			node.classList.add('reveal-on-scroll');
		});

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, {
			rootMargin: '0px 0px -10% 0px',
			threshold: 0.08
		});

		nodes.forEach(function (node) { observer.observe(node); });
	}

	function initActiveMenuLink() {
		var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
		var links = document.querySelectorAll('#menu .links a[href]');
		links.forEach(function (link) {
			var href = (link.getAttribute('href') || '').toLowerCase();
			if (!href || href.charAt(0) === '#') return;
			var targetPage = href.split('#')[0];
			if (targetPage && targetPage === page) {
				link.classList.add('is-active');
			}
		});
	}

	function initBackToTop() {
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'back-to-top';
		btn.setAttribute('aria-label', 'Back to top');
		btn.innerHTML = '&#8593;';
		document.body.appendChild(btn);

		function toggle() {
			if (window.scrollY > 320) btn.classList.add('is-visible');
			else btn.classList.remove('is-visible');
		}

		btn.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
		});

		toggle();
		window.addEventListener('scroll', toggle, { passive: true });
	}

	function initBannerMotion() {
		if (prefersReducedMotion) return;

		var banners = document.querySelectorAll('.image.main');
		banners.forEach(function (banner) {
			if (!banner.querySelector('.banner-grid')) {
				var grid = document.createElement('span');
				grid.className = 'banner-grid';
				banner.appendChild(grid);
			}
			if (!banner.querySelector('.banner-orb.orb-a')) {
				var orbA = document.createElement('span');
				orbA.className = 'banner-orb orb-a';
				banner.appendChild(orbA);
			}
			if (!banner.querySelector('.banner-orb.orb-b')) {
				var orbB = document.createElement('span');
				orbB.className = 'banner-orb orb-b';
				banner.appendChild(orbB);
			}

			var img = banner.querySelector('img');
			if (!img || window.matchMedia('(max-width: 980px)').matches) return;

			function onMove(event) {
				var rect = banner.getBoundingClientRect();
				var x = ((event.clientX - rect.left) / rect.width) - 0.5;
				var y = ((event.clientY - rect.top) / rect.height) - 0.5;
				banner.classList.add('is-tilting');
				banner.style.transform = 'perspective(1000px) rotateX(' + (-y * 2.5) + 'deg) rotateY(' + (x * 3.4) + 'deg)';
				img.style.transform = 'translate3d(' + (x * 8) + 'px,' + (y * 8) + 'px,0) scale(1.015)';
			}

			function reset() {
				banner.style.transform = '';
				img.style.transform = '';
				setTimeout(function () { banner.classList.remove('is-tilting'); }, 200);
			}

			banner.addEventListener('mousemove', onMove);
			banner.addEventListener('mouseleave', reset);
		});
	}

	function init() {
		initHeaderState();
		initAnchorScroll();
		initReveal();
		initActiveMenuLink();
		initBackToTop();
		initBannerMotion();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
