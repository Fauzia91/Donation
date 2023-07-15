export default class Helper {
    static nicedate(id) {
        const dt = new Date(parseInt(id));
        //return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-"+dt.getDay();
        const d = dt.toISOString().split("T")[0];
        const year = d.split("-")[0];
        const day = d.split("-")[2];
        const month = d.split("-")[1];
        console.log(month + "/" + day + "/" + year)
        return month + "/" + day + "/" + year
    }
}