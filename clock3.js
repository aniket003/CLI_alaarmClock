const readline = require('readline');

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
        if (timeDifference < 0) {
            // Schedule for the next week if the timeDifference is negative
            timeDifference += 7 * 24 * 60 * 60 * 1000;
        }

        this.timeout = setTimeout(() => {
            if (this.isActive) {
                console.log(`\nAlarm ringing: ${this.time} on ${this.dayOfWeek}`);
                alarmClock.promptAction(this);
            }
        }, timeDifference);

        const hoursRemaining = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutesRemaining = Math.floor((timeDifference / (1000 * 60)) % 60);
        const secondsRemaining = Math.floor((timeDifference / 1000) % 60);
        console.log(`Alarm will ring in ${hoursRemaining} hours, ${minutesRemaining} minutes, and ${secondsRemaining} seconds`);
    }

    convertDayToNumber(day) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days.indexOf(day);
    }

    snooze(alarmClock) {
        if (this.snoozeCount < 3) {
            this.snoozeCount += 1;
            const now = new Date();
            const snoozeTime = new Date(now.getTime() + 5 * 60000); // Add 5 minutes
            this.time = snoozeTime.toTimeString().split(' ')[0];
            clearTimeout(this.timeout);
            this.schedule(alarmClock);
            console.log(`Alarm snoozed to ${this.time}, Snoozes: ${this.snoozeCount}`);
        } else {
            console.log('Maximum snoozes reached for this alarm');
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
        //this.displayCurrentTime();
        this.promptUser();
    }

    displayCurrentTime() {
        setInterval(() => {
            const now = new Date();
            process.stdout.write(`\rCurrent time: ${now.toTimeString().split(' ')[0]}   `);
        }, 1000);
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

    promptAction(alarm) {
        this.rl.question('Do you want to snooze the alarm? (yes/no): ', (input) => {
            if (input.toLowerCase() === 'yes') {
                alarm.snooze(this);
            } else {
                alarm.isActive = false;
                clearTimeout(alarm.timeout);
                console.log('Alarm stopped');
            }
            this.promptUser();
        });
    }

    promptUser() {
        console.log("\nOptions: 1. Add Alarm 2. Delete Alarm 3. Exit");
        this.rl.question('Enter your choice: ', (choice) => {
            switch (choice.trim()) {
                case '1':
                    this.promptAddAlarm();
                    break;
                case '2':
                    this.promptDeleteAlarm();
                    break;
                case '3':
                    console.log("Exiting program...");
                    this.rl.close();
                    process.exit(0);
                default:
                    console.log("Invalid choice, please try again.");
                    this.promptUser();
            }
        });
    }

    promptAddAlarm() {
        this.rl.question("Enter alarm time (HH:MM:SS): ", (time) => {
            this.rl.question("Enter day of the week (e.g., Monday): ", (day) => {
                this.addAlarm(time.trim(), day.trim());
                this.promptUser();
            });
        });
    }

    promptDeleteAlarm() {
        this.rl.question("Enter alarm index to delete: ", (indexData) => {
            const index = parseInt(indexData.toString().trim());
            this.deleteAlarm(index);
            this.promptUser();
        });
    }
}

const alarmClock = new AlarmClock();
