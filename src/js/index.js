import $ from 'jquery';
import Waveform from './waveform';
window.$ = $;

$(document).ready(() => {
  const $body = $('body');
  const $innerContainer = $('#inner-container');
  const $fixedTopBorder = $('.fixed-inner-top');
  const $pages = $('.container__page');
  const pageScrollOffset = 68;
  const $leftCTA = $('.nav__left a');
  const $rightCTA = $('.nav__right a');
  let leftCTABound, rightCTABound;


  const updatePageStack = () => {
    const scrollTop = $body.scrollTop();
    // const offsetAmt = $innerContainer.offset().top - 200 - 70.4 + 8;
    // if (scrollTop > offsetAmt) $fixedTopBorder.addClass('visible');
    for (let i = 0; i < $pages.length; i++) {
      const $page = $($pages[i]);
      if (scrollTop > $page.offset().top - pageScrollOffset - (61*i)) {
        $page.addClass('fixed');
      } else {
        $page.removeClass('fixed');
      }
    }
  };

  const updateCTAScrolls = () => {
    console.log($leftCTA);
    const distance = document.documentElement.clientHeight - 32 - 53 - 16;
    leftCTABound = distance - $leftCTA.width();
    console.log($leftCTA.height());
    console.log($leftCTA.width());
    console.log(leftCTABound);
    rightCTABound = distance - $rightCTA.width();
    console.log(rightCTABound);
  }

  const updateCTAPosition = () => {
    const scrollTop = $body.scrollTop();
    const scrollHeight = document.body.scrollHeight - document.documentElement.clientHeight;
    $leftCTA.css('left', leftCTABound * (scrollTop / scrollHeight));
    $rightCTA.css('left', rightCTABound * (scrollTop / scrollHeight));
  }

  const wf = new Waveform();
  updatePageStack();
  updateCTAScrolls();
  updateCTAPosition();
  $(window).scroll(function(e) {
    updatePageStack();
    updateCTAPosition();
  });

  $(window).resize(function(e) {
    wf.reset();
    updatePageStack();
    updateCTAScrolls();
  });

  let applicationType;

  $('a.scroll').click(function(e) {
    const href = $(this).attr('href');
    const $targetPage = $(href);
    const pageIndex = $pages.index($targetPage);
    $body.stop().animate({ scrollTop: $targetPage.offset().top - 32 - (61 * (pageIndex > -1 ? pageIndex : 0)) }, 500, 'swing');
    ga('send', 'event', 'anchorLink', 'click', href);
    e.preventDefault();
    return false;
  });

  $('.apply').click(function(e) {
    applicationType = $(this).data('type');
    $('.apply-modal__title').text(applicationType);
    $('.apply-blanket').addClass('visible');
    ga('send', 'event', 'application', 'open', applicationType);
    e.preventDefault();
    return false;
  });

  $('.subscribe').click(function(e) {
    $('.subscribe-blanket').addClass('visible');
    ga('send', 'event', 'subscribe', 'open', '');
    e.preventDefault();
    return false;
  });

  const closeModal = (e) => {
    $('.blanket').removeClass('visible');
    ga('send', 'event', 'modal', 'close', '');
    e.preventDefault();
    return false;
  };
  window.closeModal = closeModal;

  $('.close-modal').click(closeModal);

  const validate = () => {
    let invalid = false;
    $('form.open-call .form-section').each(function() {
      console.log($(this).find('.form-section__input'));
      if (!$(this).find('.form-section__input').val()) {
        $(this).addClass('invalid');
        invalid = true;
      } else {
        $(this).removeClass('invalid');
      }
    });
    return !invalid;
  };

  $('.submit-form').click(e => {
    var form = $('form.open-call').serializeArray();
    var data = {};
    for (let field of form) { data[field.name] = field.value; }
    data.type = applicationType;
    data.timestamp = (new Date()).toString();
    if (validate()) {
      $.get('https://script.google.com/macros/s/AKfycbxttV8TnjMZJMltoJede1lqE3PDJpqTX5ONQTiytB7cpOR8P4c/exec', data);
      $('.apply-modal__form-container').html('<div class="submitted"><h3>THANK YOU!</h3><a href="#" onclick="closeModal()" class="close-modal physical">close</a></div>')
      ga('send', 'event', 'application', 'submit', applicationType);
    } else {
      ga('send', 'event', 'application', 'invalidSubmit', applicationType);
    }
    e.preventDefault();
    return false;
  });
});