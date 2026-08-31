(function () {
    "use strict";

    var header = document.getElementById("site-header");
    var nav = document.getElementById("site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var form = document.getElementById("contactForm");
    var statusEl = document.getElementById("formStatus");
    var links = document.querySelectorAll(".nav-link");
    var sections = document.querySelectorAll("main section[id]");
    var lastChannel = "whatsapp";

    var WHATSAPP_NUMBER = "96599702824";
    var EMAIL = "burqainintl@gmail.com";

    function setNav(open) {
        nav.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    }

    toggle.addEventListener("click", function () {
        setNav(!nav.classList.contains("is-open"));
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setNav(false);
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            var id = this.getAttribute("href");
            if (!id || id === "#") {
                return;
            }
            var target = document.querySelector(id);
            if (!target) {
                return;
            }
            event.preventDefault();
            setNav(false);
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (history.replaceState) {
                history.replaceState(null, "", id);
            }
        });
    });

    window.addEventListener("scroll", function () {
        header.classList.toggle("is-scrolled", window.scrollY > 24);

        var current = "home";
        sections.forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 180) {
                current = section.id;
            }
        });
        links.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
        });
    }, { passive: true });

    form.querySelectorAll("button[type='submit']").forEach(function (button) {
        button.addEventListener("click", function () {
            lastChannel = this.getAttribute("data-channel") || "whatsapp";
        });
    });

    function field(id) {
        return (document.getElementById(id).value || "").trim();
    }

    function showStatus(message, isError) {
        statusEl.hidden = false;
        statusEl.textContent = message;
        statusEl.classList.toggle("is-error", Boolean(isError));
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = field("name");
        var email = field("email");
        var message = field("message");

        if (!name || !email || !message) {
            showStatus("يرجى تعبئة جميع الحقول قبل الإرسال.", true);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showStatus("يرجى إدخال بريد إلكتروني صحيح.", true);
            return;
        }

        var body = [
            "السلام عليكم،",
            "",
            "الاسم: " + name,
            "البريد: " + email,
            "",
            "الرسالة:",
            message
        ].join("\n");

        if (lastChannel === "email") {
            var mailto = "mailto:" + EMAIL +
                "?subject=" + encodeURIComponent("رسالة من موقع برقان العقارية — " + name) +
                "&body=" + encodeURIComponent(body);
            showStatus("سيتم فتح تطبيق البريد لإرسال رسالتك.");
            window.location.href = mailto;
            return;
        }

        var wa = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(body);
        showStatus("سيتم فتح واتساب لإرسال رسالتك.");
        window.open(wa, "_blank", "noopener,noreferrer");
    });
})();
