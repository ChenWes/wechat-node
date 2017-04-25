jQuery(function () {
    loginIfTokenOverdue()
        .then(function (result) {
            console.log(result);
            alert(result.userName);
        })
        .catch((err) => {
            alert(err);
        });
});