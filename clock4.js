const readline = require('readline');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function isValidTime(time) {
    // Regular expression to match the HH:MM:SS format
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    // Test the time string against the regular expression
    const match = time.match(timeFormat);
    // If match is null, the time format is invalid
    return match !== null;
}

class Alarm {
    constructor(time, dayOfWeek) {
        this.time = time;
        this.dayOfWeek = dayOfWeek;
        this.snoozeCount = 0;
        this.isActive = true;
        this.timeout = null;
    }

    schedule(alarmClock) {
        const now = new Date();
        const alarmTime = new Date(now);
        const [hours, minutes, seconds] = this.time.split(':').map(Number);
        alarmTime.setHours(hours, minutes, seconds, 0);

        const dayDifference = (this.convertDayToNumber(this.dayOfWeek) - now.getDay() + 7) % 7;
        alarmTime.setDate(now.getDate() + dayDifference);

        let timeDifference = alarmTime - now;

        this.timeout = setTimeout(() => {
            if (this.isActive) {
                console.log(`Alarm ringing: ${this.time} on ${this.dayOfWeek}`);
                alarmClock.setSnoozeAlarm(this, alarmClock);
            }
        }, timeDifference);

        const hoursRemaining = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutesRemaining = Math.floor((timeDifference / (1000 * 60)) % 60);
        const secondsRemaining = Math.floor((timeDifference / 1000) % 60);
        console.log(`\nAlarm will ring in ${hoursRemaining} hours, ${minutesRemaining} minutes, and ${secondsRemaining} seconds`);
    }

    convertDayToNumber(day) {
        return days.indexOf(day);
    }

    snooze(alarmClock) {
        if (this.snoozeCount < 3) {
            this.snoozeCount += 1;
            const now = new Date();
            const snoozeTime = new Date(now.getTime() + 0.5 * 60000); // Add 5 minutes
            this.time = snoozeTime.toTimeString().split(' ')[0];
            clearTimeout(this.timeout);
            this.schedule(alarmClock);
            console.log(`\nAlarm snoozed to ${this.time}, Snoozes: ${this.snoozeCount}`);
            alarmClock.updateAlarm(this);
        } else {
            console.log('\nMaximum snoozes reached for this alarm');
        }
    }
}

class AlarmClock {
    constructor() {
        this.alarms = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.userOptions();
    }

    // Reusable input handler method
    askQuestion(prompt, callback) {
        this.rl.question(prompt, callback);
    }

    userOptions() {
        console.log("\nChoose from below Options \n1: Current Time, 2: Add Alarm, 3: Delete Alarm, 4: List of Alarm, 5: Exit");
        this.askQuestion('Enter your choice: ', (choice) => {
            switch (choice.trim()) {
                case '1':
                    this.displayCurrentTime();
                    break;
                case '2':
                    this.selectAddAlarm();
                    break;
                case '3':
                    this.selectDeleteAlarm();
                    break;
                case '4':
                    this.alarmList(true);
                    break;
                case '5':
                    console.log("Exiting program...");
                    this.rl.close();
                    process.exit(0);
                default:
                    console.log("Invalid choice, please try again.");
                    this.userOptions();
            }
        });
    }

    displayCurrentTime() {
        console.log(`\rCurrent time: ${new Date().toTimeString().split(' ')[0]}`);
        this.userOptions();
    }

    selectAddAlarm() {
        this.askQuestion("\nEnter alarm time 24 hour format (HH:MM:SS): ", (time) => {
            if (isValidTime(time)) {
                console.log("\nSelect day of the week:");
                days.forEach((day, index) => {
                    console.log(`${index}: ${day}`);
                });
                this.askQuestion("Enter day index: ", (dayIndex) => {
                    const day = days[parseInt(dayIndex.trim())];
                    if (day) {
                        this.addAlarm(time.trim(), day);
                    } else {
                        console.log("Invalid day index, please try again.");
                    }
                    this.userOptions();
                });
            } else {
                console.log("Invalid time value, please try again.");
                this.userOptions();
            }
        });
    }

    selectDeleteAlarm() {
        if (this.alarms.length === 0) {
            console.log("No alarms to delete.");
            this.userOptions();
            return;
        }

        this.alarmList();

        this.askQuestion("Enter alarm index to delete: ", (indexData) => {
            if (indexData == 'esc') {
                this.userOptions();

            } else if (isNaN(indexData) || indexData < 0 || indexData >= this.alarms.length) {
                console.log("Invalid choice, please try again.");
                this.selectDeleteAlarm();

            } else {
                const index = parseInt(indexData.toString().trim());
                this.deleteAlarm(index);
                this.userOptions();
            }
        });
    }

    addAlarm(time, dayOfWeek) {
        const alarm = new Alarm(time, dayOfWeek);
        this.alarms.push(alarm);
        alarm.schedule(this);
        console.log(`Alarm added for ${time} on ${dayOfWeek}`);
    }

    deleteAlarm(index) {
        if (index >= 0 && index < this.alarms.length) {
            clearTimeout(this.alarms[index].timeout);
            this.alarms.splice(index, 1);
            console.log(`Alarm ${index} deleted`);
        } else {
            console.log("Invalid alarm index");
        }
    }

    setSnoozeAlarm(alarm, alarmClock) {
        console.log("\nOptions: 1. Snooze Alarm 2. Delete Alarm");
        this.askQuestion('Enter choice:', (snoozeoption) => {
            switch (snoozeoption.trim()) {
                case '1':
                    alarm.snooze(this);
                    break;
                case '2':
                    alarm.isActive = false;
                    clearTimeout(alarm.timeout);
                    const index = this.alarms.indexOf(alarm);
                    if (index > -1) {
                        this.alarms.splice(index, 1);
                        console.log('Alarm deleted');
                    }
                    break;
                default:
                    console.log("Invalid choice, please try again.");
                    this.setSnoozeAlarm(alarm, this);
            }
            this.userOptions();
        });
    }

    alarmList(flag) {
        console.log("\nList of alarms:");
        this.alarms.forEach((alarm, index) => {
            console.log(`${index}: ${alarm.time} on ${alarm.dayOfWeek}`);
        });

        if (flag) {
            this.userOptions();
        }
    }

    updateAlarm(updatedAlarm) {
        const index = this.alarms.findIndex(alarm => alarm === updatedAlarm);
        if (index !== -1) {
            this.alarms[index] = updatedAlarm;
        }
    }
}

new AlarmClock();
