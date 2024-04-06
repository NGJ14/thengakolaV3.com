import json
import os
from datetime import datetime, timedelta

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
COURSE_TITLES = {
    "BCHY101": "Chemistry",
    "BPHY101": "Physics",
    "BEEE102": "BEEE",
    "BCSE202": "DSA",
    "BCSE102": "OOPS",
    "BITE202": "DL & M",
    "BMEE201": "Mechanics",
    "BCLE201": "Constr Materials",
    "BCSE103": "Java",
    "BMAT102": "Diff Eqns",
    "BECE201": "EMD",
    "BECE203": "Circuit Theory",
    "BENG101": "English",
    "BSTS202": "QSP",
    "BHUM106": "Sociology",
    "BECE102": "DSD",
    "BENG102": "Tech Report Writing",
    "BESP101": "Spanish",
    "BHUM107": "Sustain & Society",
    "BMAT201": "Complex Variables",
    "BMAT205": "Discrete Mathematics",
    "BCLE202":"fluid",
    "BCLE203":"solids",
    "BCLE204":"surveying",
    "BCLE205":"evm",
    "BCLE209":"geology",
    
}


def timings_to_datetimes(start, end):
    date = datetime(2022, 9, 19, 0, 0, 0, 0)
    start = date.replace(**dict(zip(("hour", "minute"), map(int, start.split(":")))))
    end = date.replace(**dict(zip(("hour", "minute"), map(int, end.split(":")))))
    return start, end


file_list = [file for file in os.listdir() if ".txt" in file]

for file in file_list:
    # Directly copied input from VTOP
    name = file[:-4]
    print(f"Processing {name}")

    inp = open(f"{name}.txt").read()

    # Organise input into lists
    data = [[word.strip() for word in line.split("\t")] for line in inp.split("\n") if line]

    # Remove 'Start', 'End', 'LAB', 'THEORY' and day names
    for i, line in enumerate(data):
        if line[1].isalpha():
            data[i] = line[2:]
        else:
            data[i] = line[1:]

    # Seperate out timings for theory and lab
    theory_timings = data[:2]
    lab_timings = data[2:4]
    data = data[4:]

    # Store each day's classes in that day's list
    timetable = [[] for _ in range(7)]
    for d, line in enumerate(data):
        for i, slot in enumerate(line):
            if slot != "-" and "-" in slot:
                # Every second line is a lab entry
                if d % 2 == 1:
                    start, end = timings_to_datetimes(
                        lab_timings[0][i], lab_timings[1][i]
                    )
                    if timetable[d // 2]:
                        if abs(start - timetable[d // 2][-1]["end"]) <= timedelta(
                            minutes=2
                        ):
                            timetable[d // 2][-1]["end"] = end
                            continue
                else:
                    start, end = timings_to_datetimes(
                        theory_timings[0][i], theory_timings[1][i]
                    )

                slot = slot.split("-")
                slot[1] = slot[1][:-1]

                # course_title = COURSE_TITLES.get(slot[1], slot[1])
                course_title = slot[1]

                # Every second line is a lab entry
                # course_title += " Lab" if d % 2 == 1 else ""
                course_title += "L" if d % 2 == 1 else "P"

                period = {
                    "title": course_title,
                    "venue": slot[3],
                    "start": start,
                    "end": end,
                }
                timetable[d // 2].append(period)

    timetable = [sorted(day, key=lambda x: x["start"]) for day in timetable]

    for day in timetable:
        for period in day:
            period["timings"] = [
                period["start"].hour,
                period["start"].minute,
                period["end"].hour,
                period["end"].minute,
            ]
            del period["start"]
            del period["end"]

    json.dump(timetable, open(f"../{name}.json", "w"), indent="\t")

    print(f"{name}.json created successfully.")
