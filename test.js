const util = require('util');
const exec = util.promisify(require('child_process').exec);

exec('tmux new-session -dP -s test nano ~/test1')
    .then((({ stdout, stderr }) => {
        console.log(`stdout: '${stdout}'`);
        console.error(`stderr: '${stderr}'`);
    }))
    .catch((error) => {
        if (error.stderr.includes('duplicate session')) {
            exec('tmux pipep -I -t test "echo Hello World!"');
        } else {
            console.log(':(');
        }
    });