/** @file Grunt Configuration file. */

module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            // Remove miscellaneous CSS Files
            cssFiles: {
                files: [{
                    expand: true,
                    cwd: 'src/public',
                    src: '**/*.css'
                }]
            },

            // Clean build directory
            build: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: '**/*'
                }]
            }
        },
        copy: {
            build: {
                nonull: true,
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**/*',
                    dest: 'build/'
                }]
            }
        },
        uglify: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'build/public',
                        src: '**/*.js',
                        dest: 'build/public'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Build a production ready version of Bluebird (grunt build)
    grunt.registerTask('build', 'Build a production-ready version of Bluebird.', function(){

        grunt.task.run(['clean:cssFiles', 'copy:build', 'uglify:build']);
    });
};