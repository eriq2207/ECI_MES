function SetActData() {
    moment.locale("pl")
    $("#ActualDate").text(moment().format('MMMM Do YYYY, HH:mm:ss'))
}