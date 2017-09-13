// Variables
var listItem, detailedView, background, description, media, video, image, initialOffsetX, initialOffsetY, sharedElement;

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
    window.history.pushState('obj', 'newtitle', portfolioItemAtIndex.slug);

    // Lock scroll
    view.css('overflow', 'hidden');

    // Clone the current media
    // media = $(selectedMedia).clone();

    // Create the detail item container
    // This is the view that holds the transitioned element
    body.append('<div class="detailed-view"><div class="background"></div><div class="description"><div class="content"></div></div></div>');

    // Reference to detailed view
    detailedView = $('.detailed-view');

    // Add shared elemented
    detailedView.append('<div class="shared-element"></div>');

    // Get reference to shared element
    sharedElement = $('.shared-element');

    // Create element for media source
    if (portfolioItemAtIndex.media.type === videoType) {
        media = '<video muted loop playsinline preload="none" poster="' + portfolioItemAtIndex.media.src + '"><source src="' + portfolioItemAtIndex.media.extra + '"></video>';
    } else {
        media = '<img src="' + portfolioItemAtIndex.media.src + '"/>';
    }

    // Listen to css changes of shared element
    sharedElement.on(cssValue, function (event) {
        sharedElement.unbind(cssValue);

        // Listen to element insertion
        detailedView.on(domInsertionValue, function (event) {
            detailedView.unbind(domInsertionValue);

            // Check for video
            if (portfolioItemAtIndex.media.type === videoType) {

                // Add loading indicator
                sharedElement.append('<div class="loading-indicator"><div class="indicator-container"></div></div>');

                // Find video
                video = sharedElement.children('video');

                // Listen to when transiton ends
                sharedElement.one(transitionValues, function (event) {
                    sharedElement.unbind(transitionValues);
                    video[0].play();
                });

                // Check when video begins playing
                video[0].addEventListener('playing', function () {
                    $('.loading-indicator').addClass('dismiss');
                })
            }

            // Hide list item
            listItem.addClass('hidden');

            // Detailed view element references  
            background = $('.background');
            description = $('.description');

            // Values for new position
            const mediaAreaWidth = ($(window).width() / 100) * 66;
            const mediaAreaHeight = $(window).height();

            // Animate element to new position
            sharedElement.css({
                top: (mediaAreaHeight - $(selectedMedia).height()) / 2
            });

            // Delay changing left to provide subtle arc motion
            setTimeout(function () {
                sharedElement.css({
                    left: (mediaAreaWidth - $(selectedMedia).width()) / 2
                });
            }, 25);

            // Animate elements into view
            background.css('opacity', 1);

            setTimeout(function () {
                description.css('right', '-66%');
            }, 75);

            // Set description info
            const content = $('.content');

            // Add details to the view
            if (portfolioItemAtIndex.title) {
                content.append('<h1>' + portfolioItemAtIndex.title + '</h2>');
            }
            if (portfolioItemAtIndex.role) {
                content.append('<h2>' + portfolioItemAtIndex.role + '</h2>')
            }
            if (portfolioItemAtIndex.description) {
                content.append('<div class="break"></div>');
                content.append('<p>' + portfolioItemAtIndex.description + '</p>')
            }
            if (portfolioItemAtIndex.url) {
                content.append('<a class="action-button" target="_blank" href="' + portfolioItemAtIndex.url + '" type="send-message">' + portfolioItemAtIndex.action + '</a>')
            }

            // Dismiss detailed view
            background.click(function (event) {
                history.back();
            });
        });

        // Add media to shared element
        sharedElement.append(media);
    });

    // Save initial loading positions
    const borderWidth = 2;
    initialOffsetY = ($(selectedMedia).offset().top - $(document).scrollTop()) - borderWidth
    initialOffsetX = $(selectedMedia).offset().left - borderWidth;

    // Set initial positions
    // This is where the shared element transition places the selected element
    sharedElement.cssWithListener({
        width: $(selectedMedia).width(),
        height: $(selectedMedia).height(),
        top: initialOffsetY,
        left: initialOffsetX
    });

    return;

    // Find image
    image = media.children('img');

    // Prevent click through
    media.click(function (event) {
        event.stopPropagation();
    });

    // Create the detail item container
    // This is the view that holds the transitioned element
    body.append('<div class="detailed-view"><div class="background"></div><div class="description"><div class="content"></div></div></div>');

    // Listen to css changes of shared element
    media.on(cssValue, function (event) {
        $(media).unbind(cssValue);

        // Listen to dom insertion
        const detailedViewRef = '.detailed-view';
        detailedView = $(detailedViewRef);
        $(detailedViewRef).on(domInsertionValue, function (event) {
            $(detailedViewRef).unbind(domInsertionValue);

            // Check for video
            if (portfolioItemAtIndex.media.type === videoType) {

                // Add loading indicator
                media.append('<div class="loading-indicator"><div class="indicator-container"></div></div>');

                // Find video
                video = media.children('.extra');

                // Listen to when transiton ends
                media.one(transitionValues, function (event) {
                    media.unbind(transitionValues);

                    // Change visibility
                    video.removeClass('hidden');

                    // Play video
                    video[0].play();
                });

                // Check when video begins playing
                video[0].addEventListener('playing', function () {
                    // $('.loading-indicator').remove();

                    $('.loading-indicator').addClass('dismiss');
                })
            }

            // Hide list item
            listItem.addClass('hidden');

            // Detailed view element references  
            background = $('.background');
            description = $('.description');

            // Values for new position
            const mediaAreaWidth = ($(window).width() / 100) * 66;
            const mediaAreaHeight = $(window).height();

            // Animate element to new position
            media.css({
                top: (mediaAreaHeight - $(selectedMedia).height()) / 2
            });

            // Delay changing left to provide subtle arc motion
            setTimeout(function () {
                media.css({
                    left: (mediaAreaWidth - $(selectedMedia).width()) / 2
                });
            }, 25);

            // Animate elements into view
            background.css('opacity', 1);

            setTimeout(function () {
                description.css('right', '-66%');
            }, 75);

            // Set description info
            const content = $('.content');

            // Add details to the view
            if (portfolioItemAtIndex.title) {
                content.append('<h1>' + portfolioItemAtIndex.title + '</h2>');
            }
            if (portfolioItemAtIndex.role) {
                content.append('<h2>' + portfolioItemAtIndex.role + '</h2>')
            }
            if (portfolioItemAtIndex.description) {
                content.append('<div class="break"></div>');
                content.append('<p>' + portfolioItemAtIndex.description + '</p>')
            }
            if (portfolioItemAtIndex.url) {
                content.append('<a class="action-button" target="_blank" href="' + portfolioItemAtIndex.url + '" type="send-message">' + portfolioItemAtIndex.action + '</a>')
            }

            // Dismiss detailed view
            background.click(function (event) {
                history.back();
            });
        });

        // Add shared element to media container
        media.appendTo(detailedViewRef);
    });

    // Save initial loading positions
    initialOffsetY = $(selectedMedia).offset().top - $(document).scrollTop()
    initialOffsetX = $(selectedMedia).offset().left;

    // Set initial positions
    // This is where the shared element transition places the selected element
    media.cssWithListener({
        width: $(selectedMedia).width(),
        height: $(selectedMedia).height(),
        top: initialOffsetY,
        left: initialOffsetX
    });
}

// Dismiss the shared element
dismissSharedElement = function () {

    // Check for video
    if (video) {
        video[0].pause();
    }

    // Animate shared element reseting
    description.css('right', '-100%');
    background.css('opacity', 0);

    // Set initial positions
    // This is where the shared element transition places the selected element
    sharedElement.cssWithListener({
        left: initialOffsetX
    });

    // Delay changing left to provide subtle arc motion
    setTimeout(function () {
        sharedElement.css({
            top: initialOffsetY
        });
    }, 25);

    // Background animation listener
    // Slightly faster than the normal media transition
    // Prevents flicker
    background.one(transitionValues, function (event) {
        background.unbind(transitionValues);

        // Show original list item again
        listItem.removeClass('hidden');
    });

    // Listen to transition shared element
    sharedElement.one(transitionValues, function (event) {
        sharedElement.unbind(transitionValues);

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