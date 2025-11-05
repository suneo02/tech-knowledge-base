@echo off
setlocal

:: Automatically detect script location and set base directory
set SCRIPT_DIR=%~dp0
:: Remove trailing backslash
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%
:: Go up to the base directory (assuming script is in dev\web\main)
for %%I in ("%SCRIPT_DIR%\..\..\..\") do set BASE_DIR=%%~fI

:: Relative paths
set RELEASE_PATH=release\src
set MAIN_PATH=dev\web\main

echo ======== SVN Merge Tool ========
echo Base directory: %BASE_DIR%
echo Release path: %BASE_DIR%\%RELEASE_PATH%
echo Main path: %BASE_DIR%\%MAIN_PATH%

:: Update both directories
echo Updating Release directory...
svn update %BASE_DIR%\%RELEASE_PATH%
if %ERRORLEVEL% NEQ 0 (
    echo Failed to update Release directory!
    goto :end
)

echo Updating Main directory...
svn update %BASE_DIR%\%MAIN_PATH%
if %ERRORLEVEL% NEQ 0 (
    echo Failed to update Main directory!
    goto :end
)

:: Check if release directory has uncommitted changes
echo Checking Release directory status...
svn status %BASE_DIR%\%RELEASE_PATH% | findstr /R /C:"^[ACDM]" > nul
if %ERRORLEVEL% EQU 0 (
    echo Release directory has uncommitted changes. Please commit or revert them first!
    goto :end
)

:: Check if main directory has uncommitted changes
echo Checking Main directory status...
svn status %BASE_DIR%\%MAIN_PATH% | findstr /R /C:"^[ACDM]" > nul
if %ERRORLEVEL% EQU 0 (
    echo Main directory has uncommitted changes. Please commit or revert them first!
    goto :end
)

:: Get repository URLs for both directories
echo Getting repository URLs...
svn info %BASE_DIR%\%RELEASE_PATH% --show-item url > release_url.txt
set /p RELEASE_URL=<release_url.txt
del release_url.txt

svn info %BASE_DIR%\%MAIN_PATH% --show-item url > main_url.txt
set /p MAIN_URL=<main_url.txt
del main_url.txt

:: Get main branch latest revision number
echo Getting Main branch latest revision...
svn info %BASE_DIR%\%MAIN_PATH% | findstr /i "Last Changed Rev:" > temp.txt
for /f "tokens=4" %%i in (temp.txt) do set REVISION=%%i
del temp.txt
echo Main branch latest revision: %REVISION%

:: Change to release directory for merge
cd /d %BASE_DIR%\%RELEASE_PATH%

:: First perform test merge
echo Performing Test Merge...
svn merge --dry-run %MAIN_URL%

:: Ask whether to continue
set /p CONTINUE=Continue with merge? (Y/N):
if /i "%CONTINUE%" neq "Y" goto :end

:: Execute actual merge
echo Performing Merge...
svn merge %MAIN_URL%

:: Check for conflicts after merge
svn status | findstr /R /C:"^C" > nul
if %ERRORLEVEL% EQU 0 (
    echo Conflicts detected during merge. Please resolve conflicts manually before committing!
    goto :end
)

:: Ask whether to commit
set /p COMMIT=Commit changes? (Y/N):
if /i "%COMMIT%" neq "Y" goto :end

:: Commit changes
echo Committing changes...
svn commit -m "merge from revision %REVISION%"

:end
echo Operation completed!
pause 