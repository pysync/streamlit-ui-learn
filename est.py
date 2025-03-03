import pandas as pd

# Load the Excel file
file_path = "./full requirements.xlsx"
xls = pd.ExcelFile(file_path)

print(xls.sheet_names)

df = pd.read_excel(xls, sheet_name="all")
# Display sheet names to understand the structure

print(df.head())


df_columns = "No.,大項目,中項目,小項目,詳細説明,要件定義書有無".split(",")
# Define estimation logic based on complexity categories


def estimate_effort(row):
    no = row[df_columns[0]]
    module = row[df_columns[1]]
    function = row[df_columns[2]]
    subfunction = row[df_columns[3]]
    description  = row[df_columns[4]]
    requirement_doc  = row[df_columns[5]]
    
    print(f"estimate for: {no} -> doc: {requirement_doc} -> function: {function} / {subfunction}")
   
    """
    Estimate effort based on function complexity.
    """
    note = "simple CRUD"
    requirement_hours = 0 if requirement_doc == "有" else 2  # Skip if requirement doc exists
    basic_design = 4
    detail_design = 4
    design_ui = 1 # Use template, and don't design all pages.
    code = 10  # Default for simple CRUD ( code UI 6h, code API 4h)
    fix_ut = 6
    test_ut = 4
    test_it = 4
    fixbug_it = 4
    test_st = 2
    fixbug_st = 2

    if description and  isinstance(description, str):
        # Adjust based on complexity
        if "一覧表示" in description or "検索" in description or "一覧" in description:  # Search or listing screens
            note = "Search/List screen with filters."
            code += 8  # Extra logic for search
        if "エクスポート" in description or "CSV" in description:
            note = "Includes CSV export."
            code += 8  # Export logic increases effort
        
        if "API" in description or "外部連携" in description or "連携" in description or "導入" in description:
            note = "External API integration assumed."
            code += 16  # API integration effort
            requirement_hours += 4
            basic_design += 2
            detail_design += 2
            test_it += 4
            fixbug_st += 8
        elif isinstance(subfunction, str) and ("API" in subfunction or "外部連携" in subfunction or "連携" in subfunction or "導入" in subfunction):
            note = "External API integration assumed."
            code += 16  # API integration effort
            requirement_hours += 4
            basic_design += 2
            detail_design += 2
            test_it += 4
            fixbug_st += 8
            
            
        if "レポート" in description or "集計" in description or "出力" in description or "帳票" in description:
            note = "Complex reporting logic included."
            code += 24  # Reporting complexity
            requirement_hours += 4
        elif isinstance(subfunction, str) and ("レポート" in subfunction or "集計" in subfunction or "出力" in subfunction or "帳票" in subfunction):
            note = "Complex reporting logic included."
            code += 24  # Reporting complexity
            requirement_hours += 4
   
    # Compile result row
    return [note, requirement_hours, basic_design, detail_design, design_ui,
            code, fix_ut, test_ut, test_it, fixbug_it, test_st, fixbug_st]

# Apply estimation to all rows
df_estimates = df.copy()
df_estimates[["Note", "Requirement Definition (Hours)", "Basic Design (Hours)",
              "Detail Design (Hours)", "Design UI (Hours)", "Code (Hours)", "Fix UT (Hours)",
              "Test UT (Hours)", "Test IT (Hours)", "Fixbug IT (Hours)",
              "Test ST (Hours)", "Fixbug ST (Hours)"]] = df.apply(
    lambda row: estimate_effort(row), axis=1, result_type="expand"
)

# Save as CSV
output_path = "./effort_estimates.csv"
df_estimates.to_csv(output_path, index=False)


total_requirement_hours = sum(df_estimates["Requirement Definition (Hours)"])
total_basic_design_hours = sum(df_estimates["Basic Design (Hours)"])
total_detail_design_hours = sum(df_estimates["Detail Design (Hours)"])
total_design_ui_hours = sum(df_estimates["Design UI (Hours)"])
total_code_hours = sum(df_estimates["Code (Hours)"])
total_fix_ut_hours =  sum(df_estimates["Fix UT (Hours)"])
total_test_ut_hours = sum(df_estimates["Test UT (Hours)"])

total_test_it_hours = sum(df_estimates["Test IT (Hours)"])
total_fix_it_hours = sum(df_estimates["Fixbug IT (Hours)"])

total_test_st_hours = sum(df_estimates["Test ST (Hours)"])
total_fix_st_hours = sum(df_estimates["Fixbug ST (Hours)"])

print("==========\n")
print(f"RD: {total_requirement_hours/8/20}")
print(f"UI/UX: {total_basic_design_hours/8/20}")
print(f"BD: {total_detail_design_hours/8/20}")
print(f"DD: {total_design_ui_hours/8/20}")
print(f"CODE: {total_code_hours/8/20}")
print(f"Test UT: {total_fix_ut_hours/8/20}")
print(f"Fix UT: {total_test_ut_hours/8/20}")

print(f"Test IT: {total_test_it_hours/8/20}")
print(f"Fix IT: {total_fix_it_hours/8/20}")
print(f"Test ST: {total_test_st_hours/8/20}")
print(f"Fix ST: {total_fix_st_hours/8/20}")

total_mm = total_requirement_hours + total_basic_design_hours + total_detail_design_hours + total_design_ui_hours \
    + total_code_hours + total_fix_ut_hours + total_test_ut_hours + total_test_it_hours \
        + total_test_it_hours + total_fix_it_hours + total_test_st_hours + total_fix_st_hours
        
print(f"TOTAL: {total_mm/8/20} MM")

