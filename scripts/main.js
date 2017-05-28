"use strict";
!function (e, t) {
    function n() {
        var n = e(t).width();
        n < 768 ? u.hasClass("slick-initialized") || u.slick({
            infinite: !1,
            adaptiveHeight: !0,
            dots: !0,
            speed: 300,
            slidesToShow: 1
        }) : u.hasClass("slick-initialized") && u.slick("unslick")
    }

    function a(e) {
        var t = 0;
        if (document.selection) {
            e.focus();
            var n = document.selection.createRange();
            n.moveStart("character", -e.value.length), t = n.text.length
        } else(e.selectionStart || "0" == e.selectionStart) && (t = e.selectionStart);
        return t
    }

    function r() {
        var t, n = e(this), r = n.attr("maxlength") || 2, o = n.val().length, s = event.keyCode || event.charCode;
        if ("keydown" === event.type && (n.attr("data-prev", n.val()), t = n.attr("data-prev").length), "keyup" === event.type) {
            var i = a(n[0]);
            0 !== i || 8 != s && 46 != s || n.prev("input").focus(), 0 !== i || 0 != t || 0 !== o || 8 != s && 46 != s || n.prev("input").focus(), 37 === s && 39 === s || o !== r-- || 2 !== i || n.next("input").focus()
        }
    }

    function o() {
        e(this).css("display", "block");
        var n = e(this).find(".modal-dialog"), a = (e(t).height() - n.height()) / 2, r = (e(t).width() - n.width()) / 2, o = parseInt(n.css("marginBottom"), 10);
        a < o && (a = o), n.css({"margin-top": a, "margin-right": r, "margin-left": r})
    }

    function s() {
        var n = e(t).width();
        n < 975 ? M.addClass("notouch") : M.removeClass("notouch")
    }

    function i() {
        var e = D.find(":selected"), t = e.data("link"), n = D.parents().find('[data-linktarget="select-custom"]');
        n[0] && n.attr("href", t)
    }

    var l = {};
    l.$header = null, l.$headerSubmenu = null, l.init = function (t, n) {
        this.$header = e(t), this.$headerSubmenu = e(n)
    }, sbjs.init({
        callback: function (e) {
            console.log("SourceBuster object", e)
        }
    }), l.getHeaderOffset = function () {
        return (this.$header && this.$header.length ? this.$header.outerHeight() : 0) + (this.$headerSubmenu && this.$headerSubmenu.length ? this.$headerSubmenu.outerHeight() : 0)
    }, l.calculateOffsetToElem = function (e) {
        return e instanceof jQuery ? e.offset().top - this.getHeaderOffset() : (console.error("`$elem` expect to be jQuery elem"), 0)
    };
    var c = [];
    "https://mtbankfx.mtbank.by/faq/" == location.href && (e("#faq6 .jwplayer").each(function (e) {
        c.push(this.dataset.url)
    }), jwplayer.key = "KqGDrpbhSfQkrI3Brm5Zu1zn9qlKiChHOFzmUw==", c.forEach(function (e, t) {
        jwplayer("player-faq6" + ++t).setup({file: e})
    }));
    var d = [sbjs.get.current.typ, sbjs.get.current.src, sbjs.get.current.mdm, sbjs.get.current.cmp, sbjs.get.current.cnt, sbjs.get.current.trm];
    console.log("SBJS", d), e(function () {
        l.init(".navbar-header", ".dropdown")
    });
    var u = e(".slick");
    n(), e(t).resize(n), Scrollbar.initAll();
    var f = e(".form");
    f.each(function (n, a) {
        function r(t) {
            l.removeClass("current").eq(t).addClass("current"), f.children().eq(t).addClass("completed"), t > 0 && e("html, body").animate({scrollTop: l.eq(t).offset().top - h}, 500)
        }

        function o() {
            return l.index(l.filter(".current"))
        }

        function s() {
            var t = l.find('[name="policy"]');
            t.on("change", function (t) {
                var n = e(this), a = n.is(":checked"), r = n.parents().find('input[type="submit"]');
                a ? r.attr("disabled", !1) : r.attr("disabled", !0)
            })
        }

        function i(t, n) {
            var a = e(".form__navigation__steps");
            a.children().removeClass("rendered").removeClass("inactive").eq(t - 1).addClass("rendered"), a.children().eq(t + 1).addClass("rendered").addClass("inactive"), a.children().eq(t).next().next().removeClass("rendered"), a.children().eq(t).next().nextAll().addClass("inactive"), t === n.length - 1 && c.hide()
        }

        var l = e(a).find(".form__step"), c = e(a).find(".form__navigation"), u = e(a).find(".form-error-text"), f = e(a).find(".form__navigation__steps"), h = e(".navbar-header").length ? e(".navbar-header").outerHeight() : 0;
        f.on("click", "button", function () {
            var t = e(this), n = t.index() === o() - 1, a = t.index() === o() + 1;
            return t.hasClass("completed") && a && (c.find('[type="submit"]').eq(0).trigger("click"), setTimeout(function () {
                u.is(":hidden") && (r(t.index()), i(o(), t.parents(".form").find(".form__step")))
            }, 0)), t.hasClass("completed") && n && (u.removeClass("show"), r(t.index()), i(o(), t.parents(".form").find(".form__step"))), !1
        });
        var p = [];
        t.Parsley.on("field:error", function (e) {
            var t = ParsleyUI.getErrorsMessages(e), n = (t.join(";"), e.$element.parents(".form__wrap").find("label").text());
            p.push(n), p = _.union(p)
        }), c.on("click", '[type="submit"]', function (n) {
            n.preventDefault(), p.length = 0;
            var a = e(this).parents(".form");
            if (d.forEach(function (e, t) {
                    var n = document.createElement("input");
                    n.type = "hidden", n.name = "sbjs" + t, n.value = e, a.append(n)
                }), e(this).parents(".form").parsley({
                    successClass: "form-success",
                    errorClass: "form-error",
                    classHandler: function (e) {
                        return e.$element.parents(".form__wrap")
                    },
                    errorsWrapper: "",
                    errorsContainer: function (e) {
                    }
                }).validate({group: "block-" + o()})) {
                var s = e(this), i = s.parents(".form").find(".form-error-text"), c = a.serialize();
                i.removeClass("show"), o() === l.length - 2 ? e.ajax({
                    url: "/_components/forms/formActions/action",
                    method: "POST",
                    data: c,
                    success: function (e) {
                        if (e.success) {
                            var n = s.data("redirectTo");
                            console.log(n, "redirectTo"), n ? t.location.href = n : (r(o() + 1), i.removeClass("show"))
                        }
                        e.error && i.text(e.error.message).show()
                    }
                }) : r(o() + 1)
            }
            if (p.length > 0) {
                var u = p.reduce(function (e, t, n) {
                    return e = e + " &nbsp;<span>" + t + "</span>&nbsp;"
                }, "");
                e(this).parents(".form").find(".form-error-text").addClass("show").html("Ошибка при заполнении полей " + u)
            } else e(this).parents(".form").find(".form-error-text").removeClass("show")
        }), l.each(function (t, n) {
            e(n).find(":input").attr("data-parsley-group", "block-" + t)
        }), r(0), s()
    }), e('input[data-type="phone"]').inputmask({mask: "+375-99-999-99-99"}), e('input[data-type="numbers"]').inputmask("9{14}", {placeholder: ""}), e('input[data-type="year"]').inputmask("9{4}", {placeholder: ""}), e('input[data-type="month"]').inputmask("9{2}", {placeholder: ""}), e('input[data-type="passport"]').inputmask("aa9{7}", {placeholder: ""}), e('input[data-type="ident"]').inputmask({
        mask: "9{7} a 9{3} aa 9",
        placeholder: ""
    }), e("input.day").on("keyup", function (e) {
        var t = e.target.value;
        t > 31 && (e.target.value = 31)
    }), e("input.month").on("keyup", function (e) {
        var t = e.target.value;
        t > 12 && (e.target.value = 12)
    }), e('input[data-type="letters"]').on("input", function (t) {
        var n = e(this).val(), a = n.replace(/[^а-яё]/gi, "");
        e(this).val(a)
    }), e(document).on("keypress", function (t) {
        t.isDefaultPrevented() && e(t.target).trigger("input")
    });
    var h = e(".form__select"), p = e('input[data-type="ident"]');
    h.select2(), h.on("select2:select", function (e) {
        var t = h.select2("data"), n = ["18", "6"], a = +t[0].element.getAttribute("data-select-type");
        a ? (p.inputmask({
            mask: "9{7} a 9{3} aa 9",
            placeholder: ""
        }), p.attr("minlength", n[0])) : (p.inputmask("remove"), p.attr("minlength", n[1]))
    });
    var m = e(".navbar-brand-animate"), v = e(".nav-animate");
    m.length && e(t).on("scroll", function () {
        var n = e(t).scrollTop(), a = e(".hero .hero__logo");
        if (a.length) {
            var r = a.offset().top, o = a.height();
            n > r + o ? (m.addClass("active"), v.addClass("topanimate")) : (m.removeClass("active"), v.removeClass("topanimate"))
        }
    });
    var g = e(".content__bfamily");
    if (g.length) {
        var y = function () {
            e(t).scroll(function () {
                var n = e(".main-footer").offset().top - k, a = e(t).scrollTop() + C;
                if (b < a ? g.css({position: "fixed", top: "30px"}) : g.css({position: "static"}), n < a + C) {
                    var r = n - a;
                    g.css({top: r})
                }
            })
        }, b = g.offset().top, k = (g.offset().left, g.outerHeight()), C = (g.parent().offset().left + g.position().left, 30);
        y()
    }
    e("input").on("keypress keydown", function (t) {
        var n = 9;
        t.keyCode == n && e(this).closest("input").focus()
    }), e(".date-custom input").on("focus keypress keyup keydown", function () {
        var t = e(this);
        r.call(t[0])
    });
    var w = document.querySelectorAll('.file-custom input[type="file"]');
    Array.prototype.forEach.call(w, function (e) {
        var t = e.parentNode, n = t.innerHTML;
        e.addEventListener("change", function (e) {
            var a = "", r = e.target, o = r.files[0];
            if (a = this.files && this.files.length > 1 ? (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length) : e.target.value.split("\\").pop(), a ? t.querySelector("strong").innerHTML = a : t.innerHTML = n, o) {
                var s = new FileReader;
                s.onload = function (e) {
                    var n = o.size / 1024 / 1024;
                    if (n.toFixed(2) > 20)return r.value = "", t.querySelector("strong").innerHTML = "", !1
                }, s.readAsText(o)
            }
        })
    }), Modernizr.addTest("backgroundcliptext", function () {
        var e = document.createElement("div");
        e.style.webkitBackgroundClip = "text";
        var t = e.style.cssText.indexOf("text");
        return t > 0 || void"Webkit Moz O ms Khtml".replace(/([A-Za-z]*)/g, function (t) {
                if (t + "BackgroundClip" in e.style)return !0
            })
    }), Modernizr.backgroundcliptext || e(".txt-gradient").css({background: "transparent"});
    var x, T = e(".dropdown ul"), S = T.outerHeight() + 15, H = T.find("a"), j = H.map(function () {
        var t = e(this).attr("href");
        if (0 == t.indexOf("#") && t.length > 1) {
            var n = e(t);
            if (n.length)return n
        }
        return null
    }).filter(function (e, t) {
        return !!t
    });
    j.each(function (n) {
        n.href == t.location.hash && e("body, html").scrollTop(0)
    }), e("a[data-animate]").on("click", function (t) {
        var n = e(this).data("animate"), a = e(n);
        if (n.length && a.length) {
            t.preventDefault();
            var r = l.calculateOffsetToElem(a);
            e("html, body").animate({scrollTop: r}, 300)
        }
    });
    var q = e(".navbar-collapse").is(":visible"), E = e(".navbar");
    e(".dropdown ul a").click(function (n) {
        var a = e(this).attr("href"), r = "#" === a ? 0 : e(a).offset().top - S + 1;
        e(".navbar-toggle").is(":visible") && e(".navbar-toggle").click(), e("html, body").stop().animate({scrollTop: r}, 300), t.location.hash = a, n.preventDefault()
    });
    var B;
    e(".navbar-collapse").on("shown.bs.collapse", function () {
        B = e(this).outerHeight() > e(t).height(), B && E.addClass("navbar-scroll")
    }), e(".navbar-collapse").on("hide.bs.collapse", function () {
        E.removeClass("navbar-scroll")
    });
    var A = document.location.hash, $ = {};
    $.$newsList = e("#news-list"), $.anchors = [].slice.call((e("#news-list [id^=news]") || []).map(function (e, t) {
        return t.id
    }), 0), $.isAnchorBelongs = function (e) {
        return this.anchors.indexOf(e.slice(1)) != -1
    }, console.log($.anchors), e(document).ready(function () {
        if (A) {
            var t = e(A), n = 0;
            $.isAnchorBelongs(A) && (n = t.prev() ? t.prev().outerHeight() : 0, n += 20), setTimeout(function () {
                $.isAnchorBelongs(A) && t.addClass("in");
                var a = l.calculateOffsetToElem(t) - n;
                e("body, html").animate({scrollTop: a}, 400)
            }, 400)
        }
    }), e(t).scroll(function () {
        var t = e(".navbar-header").length ? e(".navbar-header").outerHeight() : 0, n = e(".dropdown").length ? e(".dropdown").outerHeight() : 0, a = e(this).scrollTop() + t + n, r = j.map(function () {
            if (e(this).offset().top < a)return this
        });
        r = r[r.length - 1];
        var o = r && r.length ? r[0].id : "";
        x !== o && (x = o, H.parent().removeClass("active").end().filter("[href='#" + o + "']").parent().addClass("active"))
    }), e(document).on("show.bs.modal", ".modal", o), e(t).on("resize", function () {
        e(".modal:visible").each(o)
    });
    var z = document.location.hash.replace("#", "");
    if (z.length && "start" === z) {
        var O = e("#begin").offset().top;
        e(t).scrollTop(O), e("#" + z).modal("show")
    }
    var I = e(".navbar-nav2"), M = e(".nav-auth"), q = e(".navbar-collapse");
    s(), e(t).resize(s), I.on("click", ".nav-auth", function (t) {
        var n = e(this);
        M.hasClass("notouch") && (q.hasClass("in") && e(".navbar-toggle").click(), n.hasClass("open") ? n.toggleClass("open") : (M.removeClass("open"), n.addClass("open")))
    }), e(".navbar-collapse").on("shown.bs.collapse", function () {
        e(".nav-auth").removeClass("open")
    });
    var D = e(".select-custom"), L = e(".parent-download");
    D.select2({
        containerCssClass: "custom-container",
        dropdownCssClass: "custom-dropdown",
        dropdownParent: L,
        dropdownAutoWidth: !0
    }), D.on("select2:select", function (e) {
        i()
    }), i(), e(".select-custom").change(function (t) {
        t.preventDefault();
        var n = e(".select-custom").val();
        e(".download").attr("href", n)
    }), e("#toggler").click(function () {
        var e = document.getElementById("archive_news");
        "none" == e.style.display ? e.style.display = "block" : e.style.display = "none", document.getElementById("toggler").style.display = "none"
    }), e("#archive-ref").click(function () {
        var t = e("#documents").find("ul");
        e("#archive-documents").find("li.col-sm-4").appendTo(t), document.getElementById("archive-ref").style.display = "none"
    }), document.querySelectorAll("#archive-documents li").length > 0 ? document.getElementById("archive-ref").style.display = "block" : document.getElementById("archive-ref").style.display = "none", document.getElementById("archive-documents").style.display = "none"
}(jQuery, window);