

export const emojiService = (list = []) => {
    const currentDay = new Date().getDate();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    let totalDoneToday = 0;

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
        }
    }

    if (totalDoneToday === 0) {
        return { emoji: '😞', count: totalDoneToday };
    }

    if (totalDoneToday === 1) {
        return { emoji: '😫', count: totalDoneToday };
    }

    if (totalDoneToday === 2) {
        return { emoji: '😥', count: totalDoneToday };
    }

    if (totalDoneToday === 3) {
        return { emoji: '😕', count: totalDoneToday };
    }

    if (totalDoneToday === 4) {
        return { emoji: '😐', count: totalDoneToday };
    }

    if (totalDoneToday === 5) {
        return { emoji: '😉', count: totalDoneToday };
    }

    if (totalDoneToday === 6) {
        return { emoji: '😎', count: totalDoneToday };
    }

    if (totalDoneToday === 7) {
        return { emoji: '😄', count: totalDoneToday };
    }

    if (totalDoneToday >= 8) {
        return { emoji: '🤑', count: totalDoneToday };
    }


    return '😧';
}