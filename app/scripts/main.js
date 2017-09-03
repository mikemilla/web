// Document Ready
$(document).ready(function (event) {

    // Variables
    const primaryColor = '#108FFF';
    const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

    // Elements
    const logo = $('.loading .logo');
    const body = $('body');
    const view = $('html, body');
    const header = $('header');
    const headerImage = $('header .image');
    const headerTitles = $('header .titles');

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

    // Download profile image
    const profileImageURL = 'https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-profile.png?alt=media&token=ef7ce39a-bcc5-4d35-9deb-0fe478abd372';
    const profileImage = $('<img />').attr('src', profileImageURL).on('load', function () {

        // Handle downloaded image
        if (!this.complete || typeof this.naturalWidth == 'undefined' || this.naturalWidth == 0) {
            console.log('Error downloading profile image');
            showContentView();
        } else {
            headerImage.append(profileImage);
            showContentView();
        }
    });

});

// Listen to scroll events
$(window).scroll(function () {
    $('video').each(function () {
        if ($(this).visible(true)) {
            $(this)[0].play();
        } else {
            $(this)[0].pause();
        }
    })
});