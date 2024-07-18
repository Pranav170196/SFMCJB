var connection = new Postmonger.Session();
connection.trigger('ready');
connection.on('initActivity', (data) => {
    document.getElementById('description').value = JSON.stringify(data, null, 2)
});
connection.on('clickedNext', () => {
    var configuration = JSON.parse(document.getElementById('description').value);
    connection.trigger('updateActivity', configuration);
});