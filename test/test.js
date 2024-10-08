const util = require('util');
const exec = util.promisify(require('child_process').exec);

// ('tmux new-session -dP -s test nano ~/test1')
exec('>&2 echo "error"')
    .then(({ stdout, stderr }) => {
        console.log(`stdout: '${stdout}'`);
        console.error(`stderr: '${stderr}'`);
    })
    .catch(error => {
        if (error.stderr.includes('duplicate session')) {
            exec('tmux pipep -I -t test "echo Hello World!"');
        } else {
            console.error(error);
        }
    });

