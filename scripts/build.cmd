call ..\node_modules\.bin\babel ../src -d ../dist --presets react,babel-async-preset --copy-files
call ..\node_modules\.bin\webpack --config ..\config\webpack.prod.config