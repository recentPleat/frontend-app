package helpers

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func GetRootDir() string {
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	return filepath.Dir(dir)
}

func GetClientDir() string {
	dir := GetRootDir()
	return filepath.Join(dir, "client")
}

func GetPublicDir() string {
	dir := GetClientDir()
	return filepath.Join(dir, "public")
}

func GetPublicPath() string {
	dir := GetPublicDir()
	return filepath.Join(dir, "index.html")
}

func GetClientPath() string {
	return GetClientDir()
}

func GetProjectName() string {
	dir := GetRootDir()
	return strings.TrimSuffix(filepath.Base(dir), ".git")
}

func GetBuildDir() string {
	return filepath.Join(os.Getenv("GOPATH"), "bin")
}

func GetWebpackConfigFilePath() string {
	return GetClientDir() + "/webpack.config.js"
}

func GetWebpackConfig() string {
	return fmt.Sprintf(`module.exports = {
		entry: '%s/main.js',
		output: {
			pathinfo: true,
			path: '%s',
			filename: 'bundle.js',
			publicPath: '/'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		}
	};`, GetClientPath(), GetPublicDir())
}