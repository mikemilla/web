// Global variables
var videos = [];
var portfolio = [];

// Document Ready
$(document).ready(function (event) {

    // Variables
    const jsonPath = './data/portfolio.json';
    const primaryColor = '#108FFF';
    const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

    // Elements
    const logo = $('.loading .logo');
    const body = $('body');
    const view = $('html, body');
    const header = $('header');
    const headerImage = $('header .image');
    const headerTitles = $('header .titles');
    const gridList = $('.grid ul');

    // Lock scroll
    view.css({
        overflow: 'hidden',
        height: '100%'
    });

    // Page did load
    showContentView = function () {

        // Listen to logo animation out
        logo.css('margin-top', '100%');
        logo.one(transitionValues, function (event) {

            // Unlock scroll
            view.css({
                overflow: 'auto',
                height: 'auto'
            });

            // Perform animations
            body.css('margin-top', 0);
            headerTitles.css('opacity', 1);
            headerImage.css('opacity', 1);
            header.addClass('shown');

            // Listen to header animation ending
            header.one(transitionValues, function (event) {
                header.unbind(transitionValues);

                // Set background color
                body.css('background', primaryColor);

                // Loop list items in array
                $('.grid ul li').each(function (index, element) {
                    const listItemAtIndex = $(this)
                    const duration = Math.round(parseFloat(listItemAtIndex.css('transition-duration')) * 1000)

                    // Staggered load items
                    setTimeout(function () {
                        listItemAtIndex.css('opacity', 1);
                        listItemAtIndex.css('margin-top', 0);
                    }, (duration / 6) * index);
                });
            });
        });
    };

    // Create list of items
    getPortfolio = function () {

        // Get portfolio from local json
        $.getJSON(jsonPath, function (data) {

            // Loop items in portfolio
            for (var i = 0; i < data.length; i++) {

                // Add item to portfolio reference
                portfolio.push(data[i]);

                // Get item at index
                const portfolioItemAtIndex = portfolio[i];

                // Check media type and add correct list item
                if (portfolioItemAtIndex.media.type === "video") {
                    gridList.append('<li><video class="work" muted loop playsinline preload="none" poster=' + portfolioItemAtIndex.media.thumbnail + '><source src="' + portfolioItemAtIndex.media.src + '"></video></li>');
                    // gridList.append('<li><video class="work" autoplay muted loop playsinline preload="none" poster=' + portfolioItemAtIndex.media.thumbnail + '><source src="' + portfolioItemAtIndex.media.src + '"></video></li>');
                } else {
                    gridList.append('<li><img class="work" src="' + portfolioItemAtIndex.media.src + '"/></li>');
                }
            }

            // Show the content view
            showContentView();

            // Handle grid item clicks
            $('.grid ul li').click(function () {

                // Lock scroll
                view.css('overflow', 'hidden');

                const listItem = $(this);

                const currentItem = this.children[0];

                const newItem = $(currentItem).clone();
                listItem.addClass('hidden');

                // console.log(currentItem.getBoundingClientRect().width);
                // console.log($(currentItem).offset().top - $(document).scrollTop())

                var isVideo = $(currentItem).is('video');

                if (isVideo) {
                    currentItem.pause();
                }

                // Create the detail item
                body.append('<div class="detailed-view"><div class="background"></div><div class="media"></div><div class="description"></div></div>');


                if (isVideo) {
                    newItem[0].currentTime = currentItem.currentTime;
                    newItem[0].play();
                }

                // Set initial positions
                newItem.css('width', currentItem.getBoundingClientRect().width);
                newItem.css('height', currentItem.getBoundingClientRect().height);
                newItem.css('top', $(currentItem).offset().top - $(document).scrollTop());
                newItem.css('left', $(currentItem).offset().left);
                newItem.css('right', $(currentItem).offset().right);

                // Add content to media container
                newItem.appendTo('.media');

                $('.background').css('opacity', 1);

                // Animate view to center of container
                setTimeout(function () {
                    newItem.addClass('center');
                }, 0);

                $('.detailed-view').click(function (event) {

                    newItem.removeClass('center');

                    if (isVideo) {
                        newItem[0].pause();
                        currentItem.currentTime = newItem[0].currentTime
                        // currentItem.play();
                    }

                    // Listen to transition
                    newItem.one(transitionValues, function (event) {
                        newItem.unbind(transitionValues);

                        // Change me
                        listItem.removeClass('hidden');

                        // Remove detail view
                        $('.detailed-view').remove();

                        // Unlock scroll
                        view.css('overflow', 'visible');
                    });

                    $('.background').css('opacity', 1);
                    $('.background').one(transitionValues, function (event) {
                        $('.background').unbind(transitionValues);

                        // Change me
                        listItem.removeClass('hidden');

                        // Remove detail view
                        $('.detailed-view').remove();

                        // Unlock scroll
                        view.css('overflow', 'visible');
                    });
                });

            });
        });
    }

    // Download profile image
    const profileImageURL = 'https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-profile.png?alt=media&token=ef7ce39a-bcc5-4d35-9deb-0fe478abd372';
    const profileImage = $('<img />').attr('src', profileImageURL).on('load', function () {

        // Handle downloaded image
        if (!this.complete || typeof this.naturalWidth == 'undefined' || this.naturalWidth == 0) {
            console.log('Error downloading profile image');
            getPortfolio();
        } else {
            headerImage.append(profileImage);
            getPortfolio();
        }
    });

    // Get list of all video elements
    $('video').each(function (index, element) {
        videos.push(element);
    });

});

// Listen to scroll events
$(window).scroll(function () {

    // Pauses or plays video based on the users scroll position
    for (var i = 0; i < videos.length; i++) {
        const videoAtIndex = $(videos[i])
        videoAtIndex.visibleHeight() > videoAtIndex.height() / 2 ? videos[i].play() : videos[i].pause();
    }

});

// Determines how much of a view is in the viewport (pixels)
$.fn.visibleHeight = function () {
    var elBottom, elTop, scrollBot, scrollTop, visibleBottom, visibleTop, percentageInView;
    scrollTop = $(window).scrollTop();
    scrollBot = scrollTop + $(window).height();
    elTop = this.offset().top;
    elBottom = elTop + this.outerHeight();
    visibleTop = elTop < scrollTop ? scrollTop : elTop;
    visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
    return visibleBottom - visibleTop > 0 ? visibleBottom - visibleTop : 0;
}