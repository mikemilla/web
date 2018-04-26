// Variables
var

    // Views
    listItem, detailedView,
    sharedElement, closeButton,
    background, description,
    media, video, image,

    // Coordinates & Dimensions
    initialOffsetX, initialOffsetY,
    initialHeight, initialWidth,
    photoWidth, photoHeight,

    // Portfolio
    portfolioItemAtIndex; 

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

    // Get the data
    const dataSet = listItem[0].dataset
    const dataColumn = dataSet.column
    const dataIndex = dataSet.index

    // Get portfolio item for selected item
    portfolioItemAtIndex = portfolio[dataColumn][dataIndex];

    // Set the url hash
    window.history.pushState('obj', 'newtitle', portfolioItemAtIndex.slug);

    // Lock scroll
    view.css('overflow', 'hidden');

    // Create the detail item container
    // This is the view that holds the transitioned element
    body.append('<div class="detailed-view"><div class="background"></div><div class="description"><div class="content"></div></div></div>');

    // Reference to detailed view
    detailedView = $('.detailed-view');

    // Add shared elemented
    detailedView.append('<div class="close-button enter"></div> <div class="shared-element"></div>');

    // Get reference to shared element
    sharedElement = $('.shared-element');

    // Close button
    closeButton = $('.close-button');
    closeButton.click(function () {
        history.back();
    });

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
        sharedElement.on(domInsertionValue, function (event) {
            sharedElement.unbind(domInsertionValue);

            // Check for video or large photos
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
                
            } else if (portfolioItemAtIndex.media.type === photoType) {

                // Dimensions for specific photo
                photoWidth = ($(selectedMedia).width() * 1.6)
                photoHeight = ($(selectedMedia).height() * 1.6);

                // Handles large photos
                // Like shots of sketch docs
                sharedElement.css({
                    height: photoHeight,
                    width: photoWidth
                });
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
                top: portfolioItemAtIndex.media.type === photoType ?
                    (mediaAreaHeight - photoHeight) / 2 :
                    (mediaAreaHeight - $(selectedMedia).height()) / 2
            });

            // Delay changing left to provide subtle arc motion
            setTimeout(function () {
                sharedElement.css({
                    left: portfolioItemAtIndex.media.type === photoType ?
                        (mediaAreaWidth - photoWidth) / 2 :
                        (mediaAreaWidth - $(selectedMedia).width()) / 2
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
    initialWidth = $(selectedMedia).width();
    initialHeight = $(selectedMedia).height();

    // Set initial positions
    // This is where the shared element transition places the selected element
    sharedElement.cssWithListener({
        width: initialWidth,
        height: initialHeight,
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

    // Handles large photos
    if (portfolioItemAtIndex.media.type === photoType) {
        sharedElement.css({
            width: initialWidth,
            height: initialHeight,
        });
    }

    // Animate close button
    closeButton.removeClass('enter');
    closeButton.addClass('exit');

    // Set initial positions
    // This is where the shared element transition places the selected element
    sharedElement.css({
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