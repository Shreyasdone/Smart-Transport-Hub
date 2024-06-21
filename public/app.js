async function fetchTrainData() {
    const fromStationCode = document.getElementById("fromStationCode").value;
    const toStationCode = document.getElementById("toStationCode").value;
    const dateOfJourney = document.getElementById("dateOfJourney").value;

    const options = {
        method: "GET",
        url: "https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations",
        params: {
            fromStationCode: fromStationCode,
            toStationCode: toStationCode,
            dateOfJourney: dateOfJourney,
        },
        headers: {
            'X-RapidAPI-Key': '1be8ab3774mshce6a0b022fca42ep19168fjsn4c20e8b69698',
            "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
        },
    };

    try {
        const response = await axios.request(options);
        const trainCards = document.getElementById('trainCards');
        trainCards.innerHTML = ''; // Clear previous data

        if (!response.data.data || response.data.data.length === 0) {
            trainCards.innerHTML = '<p>No trains found for the selected route and date.</p>';
            return;
        }

        for (const train of response.data.data) {
            const fareAndAvailability = await fetchFareAndAvailability(train.train_number, fromStationCode, toStationCode, dateOfJourney);

            if (fareAndAvailability.length === 0) {
                continue; // Skip if fare and availability data is not fetched successfully
            }

            const card = document.createElement('div');
            card.className = 'card';

            const header = document.createElement('div');
            header.className = 'card__header';
            header.innerHTML = `
                <div class="card__title">${train.train_number} - ${train.train_name}</div>
            `;
            card.appendChild(header);

            const times = document.createElement('div');
            times.className = 'card__time';
            times.innerHTML = `
                <div>${train.from_std} ${train.from_sta}</div>
                <div>--- ${train.duration} ---</div>
                <div>${train.to_std} ${train.to_sta}</div>
            `;
            card.appendChild(times);

            const fares = document.createElement('div');
            fares.className = 'card__fare';
            fareAndAvailability.forEach(f => {
                const fareBox = document.createElement('div');
                fareBox.className = 'fare-box';

                let statusColor;
                switch(f.confirm_probability) {
                    case 'High':
                        statusColor = 'green';
                        break;
                    case 'Med':
                        statusColor = 'yellow';
                        break;
                    case 'Low':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = 'black';
                }

                fareBox.innerHTML = `
                    <h4>${f.classType}</h4>
                    <p>Total Fare: ₹${f.total_fare}</p>
                    <p style="color: ${statusColor};">Status: ${f.current_status}</p>
                    <p>Confirm Probability: ${f.confirm_probability}</p>
                `;
                fares.appendChild(fareBox);
            });
            card.appendChild(fares);

            const bookButton = document.createElement('button');
            bookButton.className = 'book-button';
            bookButton.textContent = 'Book Now';
            card.appendChild(bookButton);

            trainCards.appendChild(card);
        }
    } catch (error) {
        console.error('Error fetching train data:', error);
        document.getElementById('trainCards').innerHTML = '<p>Error fetching train data. Please try again later.</p>';
    }
}

async function fetchFareAndAvailability(trainNo, fromStation, toStation, date) {
    const classTypes = ['CC', 'SL', '3A', '2A', '1A']; // Example class types
    const promises = classTypes.map(classType => {
        const options = {
            method: 'GET',
            url: 'https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability',
            params: {
                classType: classType,
                fromStationCode: fromStation,
                quota: 'GN',
                toStationCode: toStation,
                trainNo: trainNo,
                date: date
            },
            headers: {
                'X-RapidAPI-Key': '1be8ab3774mshce6a0b022fca42ep19168fjsn4c20e8b69698',
                'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
            }
        };

        return axios.request(options).then(response => {
            const data = response.data.data[0];
            return {
                classType: classType,
                total_fare: data.total_fare,
                confirm_probability: data.confirm_probability,
                current_status: data.current_status
            };
        }).catch(error => {
            console.error(`Error fetching seat availability for ${classType}:`, error);
            return { classType: classType, total_fare: 'N/A', confirm_probability: 'N/A', current_status: 'N/A' };
        });
    });

    return Promise.all(promises);
}

// Fetch train data when the search button is clicked
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchButton').addEventListener('click', fetchTrainData);
});
