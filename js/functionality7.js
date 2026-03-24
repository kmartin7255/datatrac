//var product_classes = ['auto','mortgage','home+equity','credit+card','boat','rv','unsecured','money+market','savings','checking','cd','ira'];
var product_classes = [
  "auto",
  "credit+card",
  "mortgage",
  "unsecured",
  "cd",
  "checking",
  "home+equity",
  "rv",
  "boat",
  "money+market",
  "savings",
];

var market_ids = [17489, 17718];
var default_mkt_id = 17718;

var company_website = "https://www.direct.com";
var company_rates_url = "https://www.direct.com";

var cta_url_auto = "https://www.direct.com/borrow/vehicle-loans";
var cta_txt_auto = "Get Started";
var rates_url_auto = "https://www.direct.com/borrow/vehicle-loans";

var cta_url_mortgage = "https://www.direct.com/borrow/mortgages";
var cta_txt_mortgage = "Get Started";
var rates_url_mortgage = "https://www.direct.com/borrow/mortgages";

var cta_url_homeequity = "https://www.direct.com/borrow/home-equity";
var cta_txt_homeequity = "Get Started";
var rates_url_homeequity = "https://www.direct.com/borrow/home-equity";

var cta_url_creditcard = "https://www.direct.com/borrow/credit-cards";
var cta_txt_creditcard = "Get Started";
var rates_url_creditcard = "https://www.direct.com/borrow/credit-cards";

var cta_url_boat = "https://info.direct.com/vehicle-memberquestion";
var cta_txt_boat = "Get Started";
var rates_url_boat = "https://info.direct.com/auto-loans?#page-block-fsxj3inc64r";

var cta_url_rv = "https://info.direct.com/vehicle-memberquestion";
var cta_txt_rv = "Get Started";
var rates_url_rv = "https://info.direct.com/auto-loans?#page-block-fsxj3inc64r";

var cta_url_unsecured = "https://www.direct.com/borrow/personal-loans";
var cta_txt_unsecured = "Get Started";
var rates_url_unsecured = "https://www.direct.com/borrow/personal-loans";

var cta_url_moneymarket = "https://www.direct.com/bank/money-market-accounts";
var cta_txt_moneymarket = "Get Started";
var rates_url_moneymarket = "https://www.direct.com/bank/money-market-accounts";

var cta_url_savings = "https://info.direct.com/cd-member-question";
var cta_txt_savings = "Get Started";
var rates_url_savings = "https://www.direct.com/bank/savings-accounts.cfm";

var cta_url_checking = "https://info.direct.com/hub-memberquestion";
var cta_txt_checking = "Get Started";
var rates_url_checking = "https://info.direct.com/hub-checking";

var cta_url_cd = "https://www.direct.com/bank/cd-share-certificates";
var cta_txt_cd = "Get Started";
var rates_url_cd = "https://www.direct.com/bank/cd-share-certificates";

var cta_url_ira = "https://info.direct.com/cd-member-question";
var cta_txt_ira = "Get Started";
var rates_url_ira = "https://info.direct.com/leading-cd-rates?#page-block-jtbrcgbtl6";

// ability to pass in prod classes, markets via URL param
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const passed_products = urlParams.get("product_classes");
const passed_market_ids = urlParams.get("market_ids");

if (passed_products && passed_products.length > 0) {
  product_classes = passed_products.split(",");
}
if (passed_market_ids && passed_market_ids.length > 0) {
  market_ids = passed_market_ids.split(",");
  default_mkt_id = market_ids[0];
}

var market_names = {};
var api_key = "32a23be5-4a7d-4635-950b-41de7c13a003";

var thresholdsFeedUrl =
  "https://api.datatrac.net/api/Thresholds.json?MarketID=" +
  market_ids.toString() +
  "&ProductClass=" +
  product_classes.toString() +
  "&ApiKey=" +
  api_key;

var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
var mm_name = monthNames[mm - 1];

if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;

jQuery(document).ready(function ($) {
  "use strict";

  var today_long = mm_name + " " + dd + ", " + yyyy;
  $(".date_today").html(today_long);

  var today_short = mm + dd + yyyy;
  $(".gra_seal").attr(
    "src",
    "https://delivery.datatrac.net/content/seals/Seal-" +
      today_short +
      "-300.png"
  );
});

var productsLoaded = 0;
var markets_loaded = 0;

$(document).ajaxComplete(function () {
  "use strict";

  markets_loaded++;

  $("#market_id")
    .find("option[value=" + default_mkt_id + "]")
    .prop("selected", true)
    .addClass("default_mkt");

  selectDropdownItem(default_mkt_id);
});

function updateDropdown() {
  "use strict";

  var options = $(".select_mkt");
  var mktsWithOutperformingProds = 0;

  $.each(market_ids, function (index, value) {
    var mkt_class = "";
    var thisMktProdsQuan = $('[data-market-id="' + value + '"]').length;

    if (thisMktProdsQuan === 0) {
      mkt_class = "empty";
    }
    if (thisMktProdsQuan > 0) {
      mktsWithOutperformingProds++;
    }

    options.append(
      $("<option class='" + mkt_class + "' />")
        .val(value)
        .text(market_names[value] || value)
    );
  });

  if (mktsWithOutperformingProds < 2) {
    $(".app_wrap").addClass("single_market");
    var onlyMarketName = $("#market_id option:not(.empty)").text();
    var selectLabelText = $(".market_ids label")
      .text()
      .replace("Select a Product to ", "");
    $(".market_ids label").text(selectLabelText + " " + onlyMarketName);
  }

  selectDropdownItem(market_ids[0]);
}

function selectOnChange(selectObject) {
  "use strict";

  var value = selectObject.value;

  const sliderIds = [];
  for (var i = 0; i < market_ids.length; i++) {
    sliderIds.push("#slider_" + market_ids[i]);
  }

  for (var j = 0; j < sliderIds.length; j++) {
    try {
      $(sliderIds[j]).slick("unslick");
    } catch (e) {}
  }

  selectDropdownItem(value);

  $(".dt_api").addClass("sliderPaused");
  $(".slick-slider")
    .slick("slickSetOption", "autoplay", true)
    .slick("slickPause");
  $(".slick-slider").slick("slickGoTo", 0);
}

function selectDropdownItem(marketId) {
  "use strict";

  var selector = '[data-market-id="' + marketId + '"]';

  $(".mtk_name_long").html(market_names[marketId] || "");

  $(".productcontainer").removeClass("show");
  $(".prod_link").removeClass("show");

  $(".slider_wrap").removeClass("show");
  $("#slider_" + marketId).addClass("show js_revealed");

  $("#slider_" + marketId).on("init", function (event, slick) {
    const slideCount = slick.slideCount;
    $(this).attr("data-slide-count", slideCount);

    $(this).removeClass("no_arrows").removeClass("has_arrows");

    const arrowCount = $(this).find(".slick-arrow").length;
    if (arrowCount === 0) {
      $(this).addClass("no_arrows");
    }
    if (arrowCount > 0) {
      $(this).addClass("has_arrows");
    }
  });

  $("#slider_" + marketId)
    .not(".slick-initialized")
    .slick({
      autoplay: true,
      autoplaySpeed: 5000,
      dots: true,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });

  if ($("#" + marketId + "_slider_play").length === 0) {
    $("#slider_" + marketId)
      .find(".slick-dots")
      .append(
        ' <a class="button small slider_play" id="' +
          marketId +
          '_slider_play">play</a>'
      );
  }

  $("body").on("click", "#" + marketId + "_slider_play", function (e) {
    $(".dt_api").removeClass("sliderPaused");
    $("#slider_" + marketId)
      .slick("slickSetOption", "autoplay", true)
      .slick("slickPlay");
    e.preventDefault();
  });

  if ($("#" + marketId + "_slider_pause").length === 0) {
    $("#slider_" + marketId)
      .find(".slick-dots")
      .append(
        ' <a class="button small slider_pause" id="' +
          marketId +
          '_slider_pause">pause</a>'
      );
  }

  $("body").on("click", "#" + marketId + "_slider_pause", function (e) {
    $(".dt_api").addClass("sliderPaused");
    $("#slider_" + marketId)
      .slick("slickSetOption", "autoplay", false)
      .slick("slickPause");
    e.preventDefault();
  });

  $("#slider_" + marketId).slick("slickGoTo", 0);

  $("#slider_" + marketId).on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      var slidesToShow = $("#slider_" + marketId).slick(
        "slickGetOption",
        "slidesToShow"
      );

      if (Number(currentSlide) < Number(slick.slideCount - 1)) {
        $("#slider_" + marketId)
          .find(".slick-slide")
          .eq(currentSlide + slidesToShow + slidesToShow)
          .removeClass("bars_active bar_labels_active");
      }

      if (Number(currentSlide) === Number(slick.slideCount - 1)) {
        $("#slider_" + marketId)
          .find(".slick-slide")
          .eq(slidesToShow + slidesToShow - 1)
          .find(".badge")
          .removeClass("badge-visible");

        $("#slider_" + marketId)
          .find(".slick-slide")
          .eq(slidesToShow + slidesToShow - 1)
          .removeClass("bars_active bar_labels_active");
      }
    }
  );

  function checkActiveTabsHighlights(slick, slick_index) {
    var tabsToHighlight = Number(slick_index) - (Number(slick?.slideCount) - 1);
    for (var i = 0; i < tabsToHighlight; i++) {
      $(".prod_link.show").eq(i).addClass("active");
    }
  }

  $("#slider_" + marketId).on(
    "afterChange",
    function (event, slick, currentSlide) {
      $(".prod_link.show").removeClass("active");

      $(".productcontainer.slick-active").each(function () {
        var slick_index = $(this).attr("data-slick-index");
        $(".prod_link.show").eq(slick_index).addClass("active");

        if (Number(slick_index) >= Number(slick?.slideCount)) {
          checkActiveTabsHighlights(slick, slick_index);
        }
      });

      setTimeout(function () {
        $("#slider_" + marketId)
          .find(".slick-slide")
          .addClass("bars_active");

        setTimeout(function () {
          $("#slider_" + marketId)
            .find(".slick-slide")
            .addClass("bar_labels_active");
        }, 600);

        setTimeout(function () {
          $("#slider_" + marketId)
            .find(".badge")
            .addClass("badge-visible");
        }, 800);
      }, 50);
    }
  );

  $(".prod_link").on("click", function (e) {
    e.preventDefault();

    $(this).addClass("active").siblings().removeClass("active");

    var slide_num = $(this).attr("data-slide");
    $("#slider_" + marketId).slick("slickGoTo", slide_num - 1);

    var tgt_slide_id = slide_num - 1;
    tgt_slide_id = "#slick-slide" + tgt_slide_id.toString().padStart(2, "0");

    $(".slick-slide").removeClass("last_clicked");
    $(tgt_slide_id).addClass("last_clicked");
  });

  $(".prod_link").removeAttr("data-slide");
  var x = 1;

  $(selector)
    .addClass("show")
    .each(function () {
      if ($(this).hasClass("slick-cloned")) {
        return;
      }

      var product = $(this).data("prod");

      $("#nav_" + product)
        .removeClass("active")
        .addClass("show js_revealed")
        .attr("data-slide", x);

      if (x === 1) {
        $("#nav_" + product).addClass("active");
      }

      x++;
    });

  var new_search_ct = $(selector).attr("data-total-search-count");
  $(".mkt_inst_total").html(new_search_ct || "");
}

function assignDataOrderAttribs() {
  "use strict";

  var target_prod;

  $.each(product_classes, function (index, value) {
    target_prod = value.replace("+", "_");
    $(".prod_links_wrap #nav_" + target_prod).attr("data-order", index + 100);
    $('.productcontainer[data-prod="' + target_prod + '"]').attr(
      "data-order",
      index + 200
    );
  });
}

function sortProdNav() {
  "use strict";

  var prodLinks = $(".prod_links_wrap a");
  prodLinks.sort(function (a, b) {
    return $(a).data("order") - $(b).data("order");
  });
  $(".prod_links_wrap").html(prodLinks);
}

function sortProds() {
  "use strict";

  var prodDivs = $(".productcontainer");

  prodDivs.sort(function (a, b) {
    return (
      $(a).data("market-id") - $(b).data("market-id") ||
      $(a).data("order") - $(b).data("order")
    );
  });

  $("#products_wrap").html(prodDivs);

  $(".productcontainer").each(function (i) {
    if (i === 0) return;

    $(this)
      .find(".badge_text .highlight")
      .append("<sup class='tooltip-info-icon'><span>i</span></sup>");
  });
}

function wrapSameMktIdProds() {
  "use strict";

  $.each(market_ids, function (index, value) {
    $(".productcontainer[data-market-id='" + value + "']").wrapAll(
      '<div class="slider_wrap" id="slider_' + value + '"/>'
    );
  });
}

function refreshData() {
  "use strict";

  $(function () {
    var $prod_template = $("#product_template");

    $.get(thresholdsFeedUrl, function (data) {
      data.sort(function (a, b) {
        return a.MarketID - b.MarketID;
      });

      $.each(data, function (index, value) {
        var product = value;
        var prod_class_underscored = (product.ProductClass || "")
          .replace(" ", "_")
          .toLowerCase();

        market_names[product.MarketID] = (product.MarketName || "").replace(
          "Orlando-Kissimmee Metro",
          "Orlando Metro"
        );

        if (
          typeof product !== "undefined" &&
          product.ThresholdType !== "DoesNotOutPerform" &&
          product.ThresholdType !== "OutpeformsBelowThresholds"
        ) {
          var market_id = product.MarketID;
          var new_content_id =
            "prod_" + prod_class_underscored + "_" + market_id;

          var new_prod_content = $prod_template
            .clone()
            .addClass("block_" + prod_class_underscored)
            .prop("id", new_content_id)
            .attr("data-market-id", market_id)
            .attr("data-prod", prod_class_underscored);

          $("#products_wrap").append(new_prod_content);

          $(".block_" + prod_class_underscored).addClass("show");
          $(".block_" + prod_class_underscored).removeClass("template");

          var savings_chunks = (product.SavingsOrEarningsText || "").split("up to ");
          var savingsAmount = savings_chunks[1] || "";

          var apyApr = "APR<sup class='tooltip-info-icon'><span>i</span></sup>";
          var lowerHigher = "lower";

          var verifiedDateRaw = product.Verified_As_Of;
          var date = new Date(verifiedDateRaw);
          var verfiedDateFormatted =
            date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear();

          var detailsEnd =
            '<span class=\'dt_note\'>Analysis by <a href="http://www.datatrac.net" target="_blank">Datatrac</a> as of ' +
            verfiedDateFormatted +
            ".</span>";

          if ((product.ProductType || "") === "deposit") {
            apyApr = "APY<sup class='tooltip-info-icon'><span>i</span></sup>";
            lowerHigher = "higher";
          }

          var market_name = product.MarketName || "";
          var fi_name = product.InstitutionLongName || "";
          var fi_shortname = product.InstitutionShortName || "";
          var total_search_ct = product.Total_Search_Count || 0;
          var prod_type = product.ProductType || "";

          var rate =
            fi_name + " " + Number(product.Rate || 0).toFixed(2) + "% " + apyApr;
          var rate_fi = Number(product.Rate || 0).toFixed(2) + "% " + apyApr;
          var prodname = apyApr + " " + (product.FriendlyName || "") + " ";
          var prodclass = (product.ProductClass || "") + " ";
          var market =
            market_name +
            " " +
            Number(product.Average_Market_Rate || 0).toFixed(2) +
            "% " +
            apyApr;
          market_name = market_name + " ";
          var rate_mkt =
            "" + Number(product.Average_Market_Rate || 0).toFixed(2) + "%  " + apyApr;

          if (prod_class_underscored === "mortgage") {
            rate =
              fi_name + " " + Number(product.Rate || 0).toFixed(3) + "% " + apyApr;
            rate_fi = Number(product.Rate || 0).toFixed(3) + "% " + apyApr;
            rate_mkt =
              "" +
              Number(product.Average_Market_Rate || 0).toFixed(3) +
              "% " +
              apyApr;
          }

          var lower = product.FootNoteText || "";
          var title_text = product.TitleText || "";
          var sort_order = product.SortOrder || 0;
          var outperform_pct = product.Outperform || 0;
          var prodlabel = product.ProductLabelPlural || "";

          var cta_text = product.OutperformText || "";
          if (cta_text.length < 2) {
            cta_text = product.ThresholdCTAText || "";
          }

          var prodTerm = product.Term || 0;

          var iconFilename = "icon-car-black.svg";

          if (prod_class_underscored === "auto") {
            iconFilename = "icon-car-black.svg";
          }
          if (prod_class_underscored === "mortgage") {
            iconFilename = "6554222650d78ad8cce298ec_icon-home-black.svg";
          }
          if (prod_class_underscored === "home_equity") {
            iconFilename = "6554222650d78ad8cce298ec_icon-home-black.svg";
          }
          if (prod_class_underscored === "credit_card") {
            iconFilename = "icon-creditcard-black.svg";
          }
          if (prod_class_underscored === "boat") {
            iconFilename = "icon-boat-black.svg";
          }
          if (prod_class_underscored === "rv") {
            iconFilename = "icon-caravan-black.svg";
          }
          if (prod_class_underscored === "unsecured") {
            iconFilename = "icon-palmtree-black.svg";
          }
          if (prod_class_underscored === "money_market") {
            iconFilename = "icon-barchart-black.svg";
          }
          if (prod_class_underscored === "savings") {
            iconFilename = "icon-pig-black.svg";
          }
          if (prod_class_underscored === "checking") {
            iconFilename = "icon-check-black.svg";
          }
          if (prod_class_underscored === "cd") {
            iconFilename = "icon-certificate-black.svg";
          }
          if (prod_class_underscored === "ira") {
            iconFilename = "icon-barchart-black.svg";
          }

          $("#" + new_content_id + " .icon")
            .addClass("js_mod")
            .attr("src", iconFilename);

          var footnote_text = (product.FootNoteText || "")
            .replace(/<(?:.|\n)*?>/gm, "")
            .replace(/&nbsp;/g, " ");

          $("#" + new_content_id + " .bar_label").addClass("js_mod");

          $("#" + new_content_id + " .badge_text_wrap")
            .addClass("js_mod")
            .attr("data-tooltip", (product.FriendlyName || "") + ": " + footnote_text);

          var savingsPrefix = "Lifetime Savings";

          if ((product.ProductType || "") === "deposit") {
            savingsPrefix = "Lifetime Earnings";
          }
          if (
            prod_class_underscored === "auto" ||
            prod_class_underscored === "boat" ||
            prod_class_underscored === "rv" ||
            prod_class_underscored === "home_equity" ||
            prod_class_underscored === "mortgage" ||
            prod_class_underscored === "unsecured" ||
            prod_class_underscored === "credit_card"
          ) {
            if (Number(prodTerm) > 0) {
              var prodTermYears = Math.floor(Number(prodTerm) / 12);
              savingsPrefix = "Savings Over " + prodTermYears + " Years:";
            }
          }

          $("#" + new_content_id + " .save_up_to")
            .addClass("js_mod")
            .text(savingsPrefix);

          savingsAmount = (product.SavingsOrEarningsText || "")
            .replace("Save up to ", "")
            .replace("Earn up to ", "");

          if (product.OutperformTimesMore && product.OutperformTimesMore.length > 0) {
            savingsAmount = product.OutperformTimesMore.replace("Earn ", "");
            $("#" + new_content_id + " .savings_amt").addClass("times_more");
          }

          $("#" + new_content_id + " .savings_amt")
            .addClass("js_mod")
            .text(savingsAmount);

          if ((product.ProductType || "") === "deposit") {
            lowerHigher = "higher";
          }

          $("#" + new_content_id + " .lower_higher")
            .addClass("js_mod")
            .text(lowerHigher);

          footnote_text = (product.FootNoteText || "")
            .replace(/<(?:.|\n)*?>/gm, "")
            .replace(/&nbsp;/g, " ");

          $("#" + new_content_id).attr(
            "data-footnote",
            (product.FriendlyName || "") + ": " + footnote_text
          );

          $("#" + new_content_id + " .rate_fi").html(rate_fi);
          $("#" + new_content_id + " .rate_mkt").html(rate_mkt);

          $("#" + new_content_id)
            .attr("data-total-search-count", total_search_ct)
            .attr("data-order", sort_order);

          $(".fi_name").html(fi_name);

          $("#" + new_content_id).addClass("type_" + prod_type);
          $("#" + new_content_id + " .driver-title").html(prodlabel);
          $("#" + new_content_id + " .mtk_name_long").html(market_name);
          $("#" + new_content_id + " #SavingsOrEarningsText").html(savingsAmount);
          $("#" + new_content_id + " .fi_name").html(fi_name);
          $("#" + new_content_id + " .fi_shortname").html(fi_shortname);
          $("#" + new_content_id + " .savings_amt").html(savingsAmount);
          $("#" + new_content_id + " #Rate").html(rate);
          $("#" + new_content_id + " .market_name").html(market_name);
          $("#" + new_content_id + " #Market").html(market);

          var disclosuresURL = company_website;
          var cta_url = "";
          var rates_url = company_rates_url;

          if (prod_class_underscored === "auto") {
            cta_url = cta_url_auto;
            cta_text = cta_txt_auto;
            if (rates_url_auto.length > 0) rates_url = rates_url_auto;
          }
          if (prod_class_underscored === "mortgage") {
            cta_url = cta_url_mortgage;
            cta_text = cta_txt_mortgage;
            if (rates_url_mortgage.length > 0) rates_url = rates_url_mortgage;
          }
          if (prod_class_underscored === "home_equity") {
            cta_url = cta_url_homeequity;
            cta_text = cta_txt_homeequity;
            if (rates_url_homeequity.length > 0) rates_url = rates_url_homeequity;
          }
          if (prod_class_underscored === "credit_card") {
            cta_url = cta_url_creditcard;
            cta_text = cta_txt_creditcard;
            if (rates_url_creditcard.length > 0) rates_url = rates_url_creditcard;
          }
          if (prod_class_underscored === "boat") {
            cta_url = cta_url_boat;
            cta_text = cta_txt_boat;
            if (rates_url_boat.length > 0) rates_url = rates_url_boat;
          }
          if (prod_class_underscored === "rv") {
            cta_url = cta_url_rv;
            cta_text = cta_txt_rv;
            if (rates_url_rv.length > 0) rates_url = rates_url_rv;
          }
          if (prod_class_underscored === "unsecured") {
            cta_url = cta_url_unsecured;
            cta_text = cta_txt_unsecured;
            if (rates_url_unsecured.length > 0) rates_url = rates_url_unsecured;
          }
          if (prod_class_underscored === "money_market") {
            cta_url = cta_url_moneymarket;
            cta_text = cta_txt_moneymarket;
            if (rates_url_moneymarket.length > 0) rates_url = rates_url_moneymarket;
          }
          if (prod_class_underscored === "savings") {
            cta_url = cta_url_savings;
            cta_text = cta_txt_savings;
            if (rates_url_savings.length > 0) rates_url = rates_url_savings;
          }
          if (prod_class_underscored === "checking") {
            cta_url = cta_url_checking;
            cta_text = cta_txt_checking;
            if (rates_url_checking.length > 0) rates_url = rates_url_checking;
          }
          if (prod_class_underscored === "cd") {
            cta_url = cta_url_cd;
            cta_text = cta_txt_cd;
            if (rates_url_cd.length > 0) rates_url = rates_url_cd;
          }
          if (prod_class_underscored === "ira") {
            cta_url = cta_url_ira;
            cta_text = cta_txt_ira;
            if (rates_url_ira.length > 0) rates_url = rates_url_ira;
          }

          if (cta_text.length > 0) {
            $("#" + new_content_id + " .apply_now").html(cta_text);
          }
          if (cta_url.length > 0) {
            $("#" + new_content_id + " .apply_now").attr("href", cta_url);
          }

          $("#" + new_content_id + " .details .lower")
            .html(
              lower +
                " <a class='link_disclosures' href='" +
                rates_url +
                "' target='_blank'>view " +
                prodclass +
                " rates &amp; disclosures</a>" +
                detailsEnd
            )
            .addClass("js_touched");

          $("#" + new_content_id + " .prodname").html(prodclass);
          $("#" + new_content_id + " .prod_term").html(prodname);
          $("#" + new_content_id + " .cta_text").html(cta_text);
          $("#" + new_content_id + " .title_text").html(title_text);
          $("#" + new_content_id + " .outperf").html(outperform_pct + "%");

          $("#" + new_content_id + " .view_rates").attr("href", company_website);
          $("#" + new_content_id + " .learn_more").attr("href", company_website);

          if (prod_type === "deposit") {
            $("#" + new_content_id + " .view_rates").html("Open Account Now");
            $("#" + new_content_id + " .comparison_term").html("up to");
          }

          productsLoaded++;
        } else {
          $(".block_" + prod_class_underscored).removeClass("show");
          console.log(
            "DOES NOT OUTPERFORM: vert bars - " +
              product.ProductClass +
              " in " +
              product.MarketID +
              " (or is below thresholds)"
          );
        }
      });

      updateDropdown();
      assignDataOrderAttribs();
      sortProdNav();
      sortProds();
    })
      .fail(function () {})
      .always(function () {
        wrapSameMktIdProds();

        $(".loading-overlay").fadeOut(1000, function () {
          $(".loading-overlay").css("height", 0);
        });
      });
  });
}

refreshData();
