document.getElementById('capture-button').addEventListener('click', function() {
    html2canvas(document.getElementById('capture')).then(canvas => {
        // Create an <a> element
        let link = document.createElement('a');
        // Set the download attribute with a filename
        link.download = 'screenshot.png';
        // Convert canvas to a Data URL
        link.href = canvas.toDataURL();
        // Append the link to the body
        document.body.appendChild(link);
        // Simulate click on the link
        link.click();
        // Remove the link from the document
        document.body.removeChild(link);
    });
});
