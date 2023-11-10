import openai
import json
import os 
from time import sleep

openai.api_key = "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"
messages = []

def nmapScan():
	print("[*] Generating nmap scans...")


	jsonTemplate = """
{
  "scan": "",
  "commnad": ""
}
	"""

	nmap_scan = openai.ChatCompletion.create(
		model="gpt-4",
		messages=[
			{"role": "system", "content": f"I need you to generate 5 basic types of non-sudo nmap scans using various combinations of parameters and scanning types to run for an ethical pentest. The scans cannot require sudo permissions to run. Please provide the exact command(s) and scan type in JSON format. If a command requires user input like adding an IP at the end please do not include this in your output. Use this json template: {jsonTemplate}"}
		]
	)

	scans = nmap_scan.choices[0].message
	json_scan = json.loads(scans['content'])

	print("[*] The following scans will be performed... ")
	for scan_type in json_scan:
		print("\t- " + str(scan_type['scan']))

	files = []

	print("[*] Executing scans...")
	for scan_type in json_scan:
		cmd = str(scan_type['command'])
		name = str(scan_type['scan']).replace(" ", "_")
		
		output = os.system(cmd + f" -oN nmap_{name}.txt 127.0.0.1")
		files.append(f"nmap_{name}.txt")

	return files

def gptAnalysis(files):

	for file in files:
		with open("mass_scan.txt", "a") as writeTo:
			try:
				with open(str(file), "r") as readFrom:
					writeTo.write(str(readFrom.read()))
			except:
				print(f"[!] nmap scan for {file} did not complete, skipping...")

	scanString = ''
	with open ("mass_scan.txt", "r" ) as readScan:
		scanString += readScan.read()

	readScan.close()
	readFrom.close()
	writeTo.close()

	file_analysis = openai.ChatCompletion.create(
		model="gpt-4",
		messages=[
			{"role": "system", "content": f"Identify vulnerable IPs from these nmap scans and output which ports our ethical pentesting team should target, along with an explanation of what vulnerabilties may be present. Here is the nmap output: {scanString}"}
		]
	)

	print("[*] Analyzing...")
	analysis = file_analysis.choices[0].message
	formatted_analysis = analysis["content"].replace("\\n", "\n")

	with open ("analysis.txt", "w") as analysisFile:
		analysisFile.write(json.dumps(formatted_analysis, indent=2))
	analysisFile.close()

	with open("analysis.txt", "r") as readAnalysis:
		data = json.load(readAnalysis)

	readAnalysis.close()
	print(data)

if __name__ == "__main__":

	files = nmapScan()
	gptAnalysis(files)