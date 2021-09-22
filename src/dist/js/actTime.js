function setActDate() {
    moment.locale("pl")
    $("#actualDate").text(moment().format('MMMM Do YYYY, HH:mm:ss'))
}