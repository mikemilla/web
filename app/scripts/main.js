// Easter Egg
console.log('You looked in the console! You must be like me 😉');
console.log('The code for this app is a little old, but in case you are curious, here is a link to the code for this app on GitHub.');
console.log('https://github.com/mikemilla/web');
console.log('Mike ♥️');

// Document Ready
$(document).ready(function() {

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
    const gridLists = $('.column');

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
                gridLists.each(function (index, element) {
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

            // Save portfolio
            portfolio = data

            // Loop through list if lists
            for (var listIndex = 0; listIndex < gridLists.length; listIndex++) {

                // Index of portfolio
                const portfolioListAtIndex = portfolio[listIndex];

                // Loop items in portfolio
                for (var i = 0; i < portfolioListAtIndex.length; i++) {

                    // Get item at index
                    const portfolioItemAtIndex = portfolioListAtIndex[i];

                    // Check media type and add list item
                    const chromeClass = isChrome ? 'chrome' : 'default';
                    const listItem = '<li class="item" data-column="' + listIndex + '" data-index="' + i + '"> <img src="' + portfolioItemAtIndex.media.src + '"/> <div class="cover ' + portfolioItemAtIndex.media.type + '"><div class="icon-container"></div> </div> </li>';
                    $(gridLists[listIndex]).append(listItem);
                }
            }

            // Show the content view
            showContentView();

            // Handle list item interactions
            // const listItems = $('.staggered-grid li');
            const listItems = $('.column li');

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
    const profileImageURL = './assets/images/profile_1.png';
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