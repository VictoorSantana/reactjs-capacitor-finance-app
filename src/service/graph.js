

export default {

    buildDone: function (list = []) {
        const currentDay = new Date().getDate();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        let totalDoneToday = 0;
        let totalNotDoneToday = 0;
        let totalToDoToday = 0;

        for (var i = 0; i < list.length; i++) {
            const item = list[i];

            if (item.done) {
                if (item.finishedAt) {
                    const finishedAt = new Date(item.finishedAt);

                    const finishedDay = finishedAt.getDate();
                    const finishedYear = finishedAt.getFullYear();
                    const finishedMonth = finishedAt.getMonth();


                    if (currentDay === finishedDay) {
                        if (currentMonth === finishedMonth) {
                            if (currentYear === finishedYear) {
                                totalDoneToday++;
                            }
                        }
                    }

                }
            } else {
                totalNotDoneToday++;
            }

            totalToDoToday++;
        }

        return { done: totalDoneToday, notDone: totalNotDoneToday, toDo: totalToDoToday };

    }

}