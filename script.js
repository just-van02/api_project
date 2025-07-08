fetch('https://api.openbrewerydb.org/breweries')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('brewery-list');
    data.forEach(brewery => {
      const li = document.createElement('li');
      li.textContent = `${brewery.name} (${brewery.city}, ${brewery.state})`;
      list.appendChild(li);
    });
  })
  .catch(error => console.error('Error:', error));
