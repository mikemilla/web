// Variables
var listItem, detailedView, background, description, media;

// Launch the shared element
launchSharedElement = function (element) {

    // Prevent clicking on mobile
    // Kind of a bandaid
    if (isMobile) {
        return;
    }

    // List item clicks
    listItem = $(element);

    // Current media for selected list item
    const selectedMedia = element.children[0];

    // Get portfolio item for selected item
    const portfolioItemAtIndex = portfolio[listItem.index()];

    // Set the url hash
    window.history.pushState('obj', 'newtitle', portfolioItemAtIndex.title);

    // Lock scroll
    view.css('overflow', 'hidden');

    // Clone the current media
    media = $(selectedMedia).clone();

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
                detailedView = $('.detailed-view');
                background = $('.background');
                description = $('.description');

                // Animate elements into view
                background.css('opacity', 1);
                description.css('max-width', '30%');

                // CHANGE ME
                description.text(portfolioItemAtIndex.description);

                // Dismiss detailed view
                $(mediaContainerRef).click(function (event) {
                    history.back();
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
}

// Dismiss the shared element
dismissSharedElement = function () {

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
}

// On Back press
$(window).on(backPressValue, function (event) {
    dismissSharedElement();
});