const readline = require('readline');

class Alarm {
    constructor(time, dayOfWeek) {
        this.time = time;
        this.dayOfWeek = dayOfWeek;
        this.snoozeCount = 0;
    }

    isTimeToAlert() {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return currentTime === this.time && currentDay === this.dayOfWeek.toLowerCase();
    }

    snooze() {
        if (this.snoozeCount < 3) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 5);
            this.time = now.toTimeString().slice(0, 5);
            this.snoozeCount += 1;
            return true;
        }
        return false;
    }
}

class AlarmClock {
    constructor() {
        this.alarms = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    displayCurrentTime() {
        const now = new Date();
        console.log(`Current time: ${now.toLocaleString()}`);
    }

    addAlarm(time, dayOfWeek) {
        const alarm = new Alarm(time, dayOfWeek);
        this.alarms.push(alarm);
        console.log(`Alarm set for ${time} on ${dayOfWeek}`);
    }

    checkAlarms() {
        this.alarms.forEach((alarm, index) => {
            if (alarm.isTimeToAlert()) {
                console.log('Alarm! Time to wake up!');
                this.rl.question('Do you want to snooze the alarm? (yes/no): ', (answer) => {
                    if (answer.toLowerCase() === 'yes') {
                        if (alarm.snooze()) {
                            console.log('Alarm snoozed for 5 minutes.');
                        } else {
                            console.log('Maximum snooze limit reached.');
                        }
                    } else {
                        this.alarms.splice(index, 1);
                        console.log('Alarm dismissed.');
                    }
                });
            }
        });
    }

    start() {
        this.rl.on('line', (input) => {
            this.handleUserInput(input);
        });

        setInterval(() => {
            this.displayCurrentTime();
            this.checkAlarms();
        }, 60000);
    }

    handleUserInput(input) {
        switch (input) {
            case '1':
                this.displayCurrentTime();
                break;
            case '2':
                this.rl.question('Enter alarm time (HH:MM): ', (alarmTime) => {
                    this.rl.question('Enter day of the week: ', (dayOfWeek) => {
                        this.addAlarm(alarmTime, dayOfWeek);
                    });
                });
                break;
            case '3':
                console.log('Exiting...');
                process.exit(0);
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}

function main() {
    const alarmClock = new AlarmClock();

    console.log('\n1. Display current time');
    console.log('2. Set a new alarm');
    console.log('3. Exit');

    alarmClock.start();
}

main();
