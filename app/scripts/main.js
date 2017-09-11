// Document Ready
$(document).ready(function (event) {

    // Force remove url hashes
    history.replaceState({}, document.title, '.');

    // Check for mobile
    isMobile = $(window).width() <= 1048;

    // Variables
    const jsonPath = './data/portfolio.json';
    const primaryColor = '#108FFF';

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

                switch (portfolioItemAtIndex.media.type) {
                    case videoType:
                        gridList.append('<li class="' + chromeClass + '"> <div class="work"> <img src="' + portfolioItemAtIndex.media.src + '"/> <video class="extra hidden" muted loop playsinline preload="none" poster="' + portfolioItemAtIndex.media.src + '"><source src="' + portfolioItemAtIndex.media.extra + '"></video> <div class="overlay ' + portfolioItemAtIndex.media.type + '"></div> </div> </li>');
                        break;
                    default:
                        gridList.append('<li class="' + chromeClass + '"> <div class="work"> <img src="' + portfolioItemAtIndex.media.src + '"/> <div class="overlay ' + portfolioItemAtIndex.media.type + '"></div> </div> </li>');
                }
            }

            // Show the content view
            showContentView();

            // Handle list item interactions
            const listItems = $('.grid ul li');

            // Clicks
            listItems.click(function (event) {

                // Prevents strange reloading error
                // This is why native mobile development is better...
                event.stopImmediatePropagation();

                // Launch the shared element
                launchSharedElement(this);
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

// On Resize
$(window).resize(function () {
    isMobile = $(window).width() <= 1048;
});