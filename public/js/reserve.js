$(document).ready(() => {


    var reserveForm = $("#reserve-button");
    var rentalReserve = $("#list-selections");
    var priceReserve = $("#inputPrice");
    var partyReserve = $("#inputPartySize");
    var facilityReserve = $("#facility");

    // When the form is submitted, we validate there's an name and location entered
    reserveForm.on("click", function (event) {
        event.preventDefault();
        var userData = {
            rental: rentalReserve.val(),
            price: priceReserve.val(),
            party: partyReserve.val(),
            facility: facilityReserve.val()
        };

        // If we have an name and location we run the loginUser function and clear the form
        listUser(userData.rental, userData.price, userData.party, userData.facility);
        rentalReserve.val("");
        priceReserve.val("");
        partyReserve.val("");
        facilityReserve.val("");
    });

    function listUser(rental, price, party, facility) { // called on right side 
        console.log("test")
        $.post("/api/posts/filtered", { // left side is based on sequelize
            location: rental,
            price: price,
            size_of_party: party,
            facility: facility
        })
            .then(function (results) {
                browseDiv.empty()
                console.log("headache")
                for (i = 0; i < results.length; i++) {
                    displayRental(results[i]);
                } //later for whichever html
                // If there's an error, log the error
            })
        // .catch(function (err) {
        //     console.log(err);
        // });
    }




    //browseDiv to hold all rental cards
    var browseDiv = $("#browse-rentals");

    //variable to hold data from database
    var rentalData;

    //Click event for the reserve button
    $(document).on("click", "button.reserve", reserveRental);

    //Get request to retrieve data from Posts table and display cards
    $.get("/api/posts").then(data => {
        console.log("rentals", data);
        rentalData = data;
        console.log("listingData:", rentalData);

        if (!rentalData || !rentalData.length) {
            displayNoRentals();
        } else {
            for (i = 0; i < rentalData.length; i++) {
                displayRental(rentalData[i]);
            }
        }

    });

    //Reserve rental function updates status in database to "reserved" when button is clicked
    function reserveRental() {

        console.log("test")
        const dataId = $(this).attr("data-id");

        console.log(dataId);
        const dataObject = {};

        dataObject.id = dataId

        $.ajax({
            url: '/api/posts',
            type: 'PUT',
            data: dataObject,

        }).then(function () {
            console.log("success");
        })
        //put content here, for now console.log
        console.log("Rental Reserved");
    };

    // This function displays a message when there are no rentals
    function displayNoRentals() {
        browseDiv.empty();
        var messageH5 = $("<h5>");
        messageH5.css({ "margin-top": "25px" });
        messageH5.html("No listings found, navigate <a href='/'>here</a> to visit homepage");
        browseDiv.append(messageH5);
    };

    //Function to display rentals
    function displayRental(rentalData) {
        var rentalCard = $("<div>");
        rentalCard.addClass("col");

        var locationCol = rentalData.location;
        var imgSrc;


        switch (locationCol) {
            case "RV":
                imgSrc = "../images/AdobeStock_rv.jpeg";
                break;
            case "Campsites":
                imgSrc = "../images/AdobeStock_default.jpeg";
                break;
            case "Farmland":
                imgSrc = "../images/AdobeStock_farmland.jpeg";
                break;
            case "Waterfront":
                imgSrc = "../images/AdobeStock_waterfront.jpeg";
                break;
            case "Backyard":
                imgSrc = "../images/AdobeStock_backyard.jpeg";
                break;
            default:
                imgSrc = "../images/AdobeStock_campsite.jpeg";
        };


        console.log("lin74" + locationCol + "imgSrc" + imgSrc);


        rentalCard.html(
            `<div class="card" style="width: 18rem;">
                <img class="card-img-top" src=${imgSrc} alt="Card image cap">
                <div class="card-body">
                    <h5>${rentalData.property_name}</h5>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><h6>Property type: ${rentalData.location}</h6>
                  </li>
                  <li class="list-group-item"><h6>Address:</h6>
                  <p>${rentalData.address}, ${rentalData.city}, ${rentalData.state}</p></li>
                  <li class="list-group-item"><h6>$${rentalData.price}/ Per day</h6>
                  </li>
                  <li class="list-group-item"><h6>Maximum ${rentalData.size_of_party} people per day</h6>
                  </li>
                  <li class="list-group-item"><h6>Bathrooms available: ${rentalData.facility}</h6>
                  </li>
                  <li class="list-group-item"><h6>Currently reserved: ${rentalData.reserved}</h6>
                  </li>
                </ul>
                <div class="card-body">
                <button type="button" data-id='${rentalData.id}' class="btn btn-outline-success reserve">Reserve this location</button>
                </div>
              </div>`
        )

        // $(".card-img-top").attr("src", imgSrc)
        browseDiv.append(rentalCard);

        // <button type="button" class="btn btn-outline-success reserve">Reserve this location</button>

        // $(".card-img-top").attr("src", imgSrc)
        browseDiv.append(rentalCard);

    };
});