// Global variables
var videos = [];
var portfolio = [];
var isMobile = false;

// Global constants
const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
const domInsertionValue = 'DOMNodeInserted';
const cssValue = 'stylechanged';
const view = $('html, body');
const body = $('body');
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

// On Resize
$(window).resize(function () {
    isMobile = $(window).width() <= 1048;
});

// Document Ready
$(document).ready(function (event) {

    // Check for mobile
    isMobile = $(window).width() <= 1048;

    // Variables
    const jsonPath = './data/portfolio.json';
    const primaryColor = '#108FFF';
    const videoType = 'video';

    // Elements
    const logo = $('.loading .logo');
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
                var chromeClass = isChrome ? 'chrome' : 'default';
                var autoplayClass = isMobile ? 'autoplay' : '';
                if (portfolioItemAtIndex.media.type === videoType) {
                    gridList.append('<li class="' + chromeClass + '"><video class="work ' + chromeClass + '" ' + autoplayClass + ' muted loop playsinline preload="none" poster=' + portfolioItemAtIndex.media.thumbnail + '><source src="' + portfolioItemAtIndex.media.src + '"></video></li>');
                } else {
                    gridList.append('<li class="' + chromeClass + '"><img class="work ' + chromeClass + '" src="' + portfolioItemAtIndex.media.src + '"/></li>');
                }
            }

            // Show the content view
            showContentView();

            // Handle list item interactions
            const listItems = $('.grid ul li');

            // On Hover
            listItems.mouseover(function () {

                // Prevent clicking on mobile
                // Kind of a bandaid
                if (isMobile) {
                    return;
                }

                // List item clicks
                const listItem = $(this);

                // Get media item
                const media = listItem[0].children[0];
                if ($(media).is(videoType)) {
                    media.play();
                }
            });

            // Off Hover
            listItems.mouseout(function () {

                // Prevent clicking on mobile
                // Kind of a bandaid
                if (isMobile) {
                    return;
                }

                // List item clicks
                const listItem = $(this);

                // Get media item
                const media = listItem[0].children[0];
                if ($(media).is(videoType)) {
                    media.pause();
                }
            });

            // Clicks
            listItems.click(function (event) {

                // Prevent clicking on mobile
                // Kind of a bandaid
                if (isMobile) {
                    return;
                }

                // Prevents strange reloading error
                // This is why native mobile development is better...
                event.stopImmediatePropagation();

                // List item clicks
                const listItem = $(this);

                // Current media for selected list item
                const selectedMedia = this.children[0];

                // Get portfolio item for selected item
                const portfolioItemAtIndex = portfolio[listItem.index()];

                // Lock scroll
                view.css('overflow', 'hidden');

                // Clone the current media
                const media = $(selectedMedia).clone();

                // Prevent click through
                media.click(function (event) {
                    event.stopPropagation();
                });

                // Create the detail item container
                // This is the view that holds the transitioned element
                body.append('<div class="detailed-view"><div class="background"></div><div class="media"></div><div class="description"></div></div>');

                // Is current item a video?
                if ($(media).is(videoType)) {

                    // Adds the auto play property to the video tag
                    // This is supported in safari, but video.play() isn't... 😤
                    media.prop('autoplay', true);
                }

                // Listen to css changes of shared element
                media.on(cssValue, function (event) {

                    // Listen to dom insertion
                    const mediaContainerRef = '.media';
                    $(mediaContainerRef).on(domInsertionValue, function (event) {

                        // Items have been added
                        if ($(event.target).hasClass('work')) {

                            // Animate background color
                            $('.background').css('opacity', 1);

                            // Animate view to center of container
                            // Done with time out to give time to add element to DOM
                            setTimeout(function () {
                                if (isChrome) {
                                    listItem.addClass('hidden');
                                }
                                media.addClass('center');
                            }, 0);

                            // Detailed view element references  
                            const detailedView = $('.detailed-view');
                            const background = $('.background');
                            const description = $('.description');

                            // Animate elements into view
                            background.css('opacity', 1);
                            description.css('max-width', '30%');

                            // CHANGE ME
                            description.text(portfolioItemAtIndex.description);

                            // Dismiss detailed view
                            $(mediaContainerRef).click(function (event) {

                                // Animate shared element reseting
                                media.removeClass('center');
                                description.css('max-width', '0%');
                                background.css('opacity', 0);

                                // Listen to background animation
                                background.one(transitionValues, function (event) {
                                    background.unbind(transitionValues);

                                    // Show original list item again
                                    if (isChrome) {
                                        listItem.removeClass('hidden');
                                    }
                                });

                                // Handle fallback browser dismiss
                                if (!isChrome) {
                                    setTimeout(function () {

                                        // Remove detail view
                                        detailedView.remove();

                                        // Unlock scroll
                                        view.css('overflow', 'visible');

                                    }, 310);
                                }

                                // Listen to transition shared element
                                media.one(transitionValues, function (event) {
                                    media.unbind(transitionValues);

                                    // Remove detail view
                                    detailedView.remove();

                                    // Show original list item again (fallback)
                                    listItem.removeClass('hidden');

                                    // Unlock scroll
                                    view.css('overflow', 'visible');
                                });
                            });
                        }
                    });

                    // Add shared element to media container
                    media.appendTo(mediaContainerRef);
                });

                // Set initial positions
                // This is where the shared element transition places the selected element
                media.cssWithListener({
                    width: selectedMedia.getBoundingClientRect().width,
                    height: selectedMedia.getBoundingClientRect().height,
                    top: $(selectedMedia).offset().top - $(document).scrollTop(),
                    left: $(selectedMedia).offset().left
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

});

// Extensions for listening to css changes
(function () {
    orig = $.fn.css;
    $.fn.cssWithListener = function () {
        var result = orig.apply(this, arguments);
        $(this).trigger(cssValue);
        return result;
    }
})();