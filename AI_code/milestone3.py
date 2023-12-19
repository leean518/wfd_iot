import openai
import json
import os 
from time import sleep

openai.api_key = "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"		## PLACE API KEY HERE
messages = []

#NOTE: Method not really needed as this performs an Nmap scan on the local machine.
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
			{"role": "system", "content": f"I need you to generate 5 basic types of non-sudo nmap scans using various combinations of parameters and scanning types to run for an ethical pentest. The scans cannot require sudo permissions to run. Only provide the JSON. Do NOT provide any other text besides the JSON output. Please provide the exact command(s) and scan type in JSON format. If a command requires user input like adding an IP at the end please do not include this in your output. Use this json template: {jsonTemplate}"}
		]
	)

	scans = nmap_scan.choices[0].message
	print(scans)
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

#Method responsible for performing the analysis on the nmap result
def gptAnalysis(files, type_of_attack):

	#reads files containing nmap output and combines it into one file
	for file in files:
		with open("mass_scan.txt", "a") as writeTo:
			try:
				with open(str(file), "r") as readFrom:
					writeTo.write(str(readFrom.read()))
			except:
				print(f"[!] nmap scan for {file} did not complete, skipping...")

	#Generates a nmap result string that is then fed to the LLM for analysis
	scanString = ''
	with open ("mass_scan.txt", "r" ) as readScan:
		scanString += readScan.read()

	readScan.close()
	readFrom.close()
	writeTo.close()

	#OpenAI query
	file_analysis = openai.ChatCompletion.create(
		model="gpt-4",
		messages=[
			{"role": "system", "content": f"Identify vulnerable IPs from these nmap scans and output which ports our ethical pentesting team should target for a {type_of_attack} in a JSON array format along with the type of service running on that port and IP address with no other extra text. Here is the nmap output: {scanString}"}
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

def generateAttackCommand(type_of_attack):
	from llama_cpp import Llama
	ip_list = None
	with open("analysis.txt", "r") as readAnalysis:
		content_as_string = readAnalysis.read()
		json_formatted_string = json.loads(content_as_string)
		ip_list = json.loads(json_formatted_string)
	llm = Llama(model_path="luna-ai-llama2-uncensored.Q6_K.gguf")
	command_list = []
	for ip in ip_list:
		ip_addr = ip["IP"]
		port = ip["Port"]
		service = ip["Service"]
		output = llm(
		f"Q: Provide the command line interface commands for performing a flooding attack using hping on the host {ip_addr} with port number {port} that is running {service} without any additional parameters. Do not provide any explanation or additional wording. Only provide the command in the response.  A:", # Prompt
		max_tokens=1000, # Generate up to 32 tokens
		stop=["Q:"], # Stop generating just before the model would generate a new question
		echo=False, # Echo the prompt back in the output
		)
		command_list.append(output["choices"][0]["text"]) #Note: I have provided partial extraction of the data, you will have to do the rest. But the answer is generated after "A:"
	print(command_list)
if __name__ == "__main__":

	#files = nmapScan() Commented out since we will be using testbed Nmap results
	#gptAnalysis(files=["output.txt"], type_of_attack="DOS flooding attack") 
	generateAttackCommand(type_of_attack="DOS Attack")
